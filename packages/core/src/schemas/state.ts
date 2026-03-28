import { z } from 'zod';

// ---------------------------------------------------------------------------
// Primitives
// ---------------------------------------------------------------------------

const dressIdSchema = z
  .string()
  .regex(/^[a-z][a-z0-9-]*$/);

const weekdaySchema = z.enum(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']);

// ---------------------------------------------------------------------------
// Applied cron — what was actually registered in openclaw
// ---------------------------------------------------------------------------

export const appliedCronSchema = z.object({
  qualifiedId: z.string(),
  displayName: z.string(),
  skill: z.string(),
  channel: z.string().optional(),
});

// ---------------------------------------------------------------------------
// Cron schedule — the user's scheduling choices
// ---------------------------------------------------------------------------

const cronScheduleSchema = z.object({
  time: z.string().regex(/^\d{2}:\d{2}$/),
  days: z.array(weekdaySchema),
  channel: z.string().optional(),
});

// ---------------------------------------------------------------------------
// Applied state — tracks everything clawset has applied for a dress
// ---------------------------------------------------------------------------

export const appliedStateSchema = z.object({
  crons: z.array(appliedCronSchema).default([]),
  skills: z.array(z.string()).default([]),
  installedSkills: z.array(z.string()).default([]),
  plugins: z.array(z.string()).default([]),
  installedPlugins: z.array(z.string()).default([]),
  memorySections: z.array(z.string()).default([]),
  files: z.array(z.string()).default([]),
  heartbeatEntries: z.array(z.string()).default([]),
  workspaceFiles: z.array(z.string()).default([]),
  underwear: z.array(z.string()).default([]),
});

// ---------------------------------------------------------------------------
// Dress entry — a worn dress in state
// ---------------------------------------------------------------------------

export const dressEntrySchema = z.object({
  registryVersion: z.string(),
  installedAt: z.string().datetime(),
  schedule: z.object({
    timezone: z.string(),
    crons: z.record(z.string(), cronScheduleSchema).default({}),
  }),
  params: z.record(z.string(), z.record(z.string(), z.unknown())).default({}),
  applied: appliedStateSchema,
});

// ---------------------------------------------------------------------------
// Underwear entry — installed underwear in state
// ---------------------------------------------------------------------------

export const underwearAppliedSchema = z.object({
  plugins: z.array(z.string()).default([]),
  installedPlugins: z.array(z.string()).default([]),
});

export const underwearEntrySchema = z.object({
  registryVersion: z.string(),
  installedAt: z.string().datetime(),
  applied: underwearAppliedSchema,
});

// ---------------------------------------------------------------------------
// State file — the full ~/.clawset/state.json
// ---------------------------------------------------------------------------

export const stateFileSchema = z.object({
  version: z.literal(1),
  serial: z.number().int().nonnegative(),
  openclawDir: z.string(),
  dresses: z.record(dressIdSchema, dressEntrySchema).default({}),
  underwear: z.record(dressIdSchema, underwearEntrySchema).default({}),
});

// ---------------------------------------------------------------------------
// Config file — ~/.clawset/config.json
// ---------------------------------------------------------------------------

export const clawsetConfigSchema = z.object({
  openclawDir: z.string(),
  timezone: z.string().default('UTC'),
  version: z.string().default('0.1.0'),
});

// ---------------------------------------------------------------------------
// Inferred types
// ---------------------------------------------------------------------------

export type AppliedCron = z.infer<typeof appliedCronSchema>;
export type AppliedState = z.infer<typeof appliedStateSchema>;
export type DressEntry = z.infer<typeof dressEntrySchema>;
export type UnderwearApplied = z.infer<typeof underwearAppliedSchema>;
export type UnderwearEntry = z.infer<typeof underwearEntrySchema>;
export type StateFile = z.infer<typeof stateFileSchema>;
export type ClawsetConfig = z.infer<typeof clawsetConfigSchema>;
