#!/usr/bin/env bun
/**
 * Validates all dresses and underwear in registry/, then generates registry.json.
 *
 * Validation:
 *  - dress.json / underwear.json parse against Zod schemas
 *  - param defaults match their declared type (enforced by schema)
 *  - every cron.skill references a key in skills
 *  - every cron.channel is in requires.underwear
 *  - every bundled skill has a .md file
 *  - every {{placeholder}} in a bundled .md has a matching param or is an auto-var (error)
 *  - every declared param appears as {{param}} in the .md (warning)
 */

import { readFileSync, readdirSync, existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { dressJsonSchema, type DressJson } from '../packages/core/src/schemas/dress-json.js';
import { underwearJsonSchema } from '../packages/core/src/schemas/underwear-json.js';
import type { RegistryIndex } from '../packages/core/src/schemas/registry.js';

const REGISTRY_DIR = join(import.meta.dir, '..', 'registry');
const DRESSES_DIR = join(REGISTRY_DIR, 'dresses');
const UNDERWEAR_DIR = join(REGISTRY_DIR, 'underwear');

// Auto-vars injected by the CLI — not declared as params
const AUTO_VARS = new Set([
  'dress.id',
  'dress.name',
  'memory.dailySections',
  'memory.reads',
  'workspace.root',
]);
const AUTO_VAR_PREFIXES = ['workspace.'];

function isAutoVar(name: string): boolean {
  if (AUTO_VARS.has(name)) return true;
  return AUTO_VAR_PREFIXES.some((p) => name.startsWith(p));
}

function extractPlaceholders(content: string): Set<string> {
  const matches = content.match(/\{\{([^}]+)\}\}/g);
  if (!matches) return new Set();
  return new Set(matches.map((m) => m.slice(2, -2).trim()));
}

let errors = 0;
let warnings = 0;

function error(msg: string): void {
  console.error(`  ✗ ${msg}`);
  errors++;
}

function warn(msg: string): void {
  console.warn(`  ⚠ ${msg}`);
  warnings++;
}

// ---------------------------------------------------------------------------
// Validate dresses
// ---------------------------------------------------------------------------

const dressIndex: RegistryIndex['dresses'] = {};

const dressDirs = existsSync(DRESSES_DIR) ? readdirSync(DRESSES_DIR) : [];
for (const dir of dressDirs) {
  const dressPath = join(DRESSES_DIR, dir, 'dress.json');
  if (!existsSync(dressPath)) continue;

  console.log(`dress: ${dir}`);

  let dress: DressJson;
  try {
    const raw = JSON.parse(readFileSync(dressPath, 'utf-8'));
    const result = dressJsonSchema.safeParse(raw);
    if (!result.success) {
      for (const issue of result.error.issues) {
        error(`${issue.path.join('.')}: ${issue.message}`);
      }
      continue;
    }
    dress = result.data;
  } catch (e) {
    error(`Failed to parse dress.json: ${e}`);
    continue;
  }

  if (dress.id !== dir) {
    error(`dress.id "${dress.id}" does not match directory name "${dir}"`);
  }

  // Validate cron → skill references
  for (const cron of dress.crons) {
    if (!dress.skills[cron.skill]) {
      error(`cron "${cron.id}" references skill "${cron.skill}" which is not in skills`);
    }
    if (cron.channel && cron.channel !== 'last' && !dress.requires.underwear.includes(cron.channel)) {
      error(`cron "${cron.id}" uses channel "${cron.channel}" not in requires.underwear`);
    }
  }

  // Validate skills
  for (const [skillId, skillDef] of Object.entries(dress.skills)) {
    if (skillDef.source === 'clawhub') continue;

    // Check .md file exists
    const mdPath = join(DRESSES_DIR, dir, 'skills', `${skillId}.md`);
    if (!existsSync(mdPath)) {
      error(`bundled skill "${skillId}" has no .md file at skills/${skillId}.md`);
      continue;
    }

    // Validate placeholder ↔ param sync
    const content = readFileSync(mdPath, 'utf-8');
    const placeholders = extractPlaceholders(content);
    const declaredParams = new Set(Object.keys(skillDef.params));

    for (const placeholder of placeholders) {
      if (!declaredParams.has(placeholder) && !isAutoVar(placeholder)) {
        error(`skill "${skillId}": {{${placeholder}}} has no matching param or auto-var`);
      }
    }

    for (const param of declaredParams) {
      if (!placeholders.has(param)) {
        warn(`skill "${skillId}": param "${param}" is declared but never used as {{${param}}}`);
      }
    }
  }

  dressIndex[dress.id] = {
    name: dress.name,
    version: dress.version,
    description: dress.description,
    requires: { underwear: dress.requires.underwear },
    path: `dresses/${dir}`,
  };
}

// ---------------------------------------------------------------------------
// Validate underwear
// ---------------------------------------------------------------------------

const underwearIndex: RegistryIndex['underwear'] = {};

const uwDirs = existsSync(UNDERWEAR_DIR) ? readdirSync(UNDERWEAR_DIR) : [];
for (const dir of uwDirs) {
  const uwPath = join(UNDERWEAR_DIR, dir, 'underwear.json');
  if (!existsSync(uwPath)) continue;

  console.log(`underwear: ${dir}`);

  try {
    const raw = JSON.parse(readFileSync(uwPath, 'utf-8'));
    const result = underwearJsonSchema.safeParse(raw);
    if (!result.success) {
      for (const issue of result.error.issues) {
        error(`${issue.path.join('.')}: ${issue.message}`);
      }
      continue;
    }
    const uw = result.data;

    if (uw.id !== dir) {
      error(`underwear.id "${uw.id}" does not match directory name "${dir}"`);
    }

    underwearIndex[uw.id] = {
      name: uw.name,
      version: uw.version,
      description: uw.description,
      path: `underwear/${dir}`,
    };
  } catch (e) {
    error(`Failed to parse underwear.json: ${e}`);
  }
}

// ---------------------------------------------------------------------------
// Cross-validate: dress underwear refs exist in registry
// ---------------------------------------------------------------------------

for (const [dressId, entry] of Object.entries(dressIndex)) {
  for (const uwId of entry.requires.underwear) {
    if (!underwearIndex[uwId]) {
      error(`dress "${dressId}" requires underwear "${uwId}" which is not in the registry`);
    }
  }
}

// ---------------------------------------------------------------------------
// Generate registry.json
// ---------------------------------------------------------------------------

if (errors > 0) {
  console.error(`\n${errors} error(s), ${warnings} warning(s). Registry not generated.`);
  process.exit(1);
}

const registry: RegistryIndex = {
  version: 1,
  generatedAt: new Date().toISOString(),
  dresses: dressIndex,
  underwear: underwearIndex,
};

const outPath = join(REGISTRY_DIR, 'registry.json');
writeFileSync(outPath, JSON.stringify(registry, null, 2) + '\n');

console.log(`\n✓ registry.json generated (${Object.keys(dressIndex).length} dresses, ${Object.keys(underwearIndex).length} underwear)`);
if (warnings > 0) {
  console.warn(`  ${warnings} warning(s)`);
}
