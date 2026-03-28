import { z } from 'zod';

// ---------------------------------------------------------------------------
// registry.json schema — lightweight index for discovery
// ---------------------------------------------------------------------------

const registryDressEntrySchema = z.object({
  name: z.string(),
  version: z.string(),
  description: z.string().default(''),
  requires: z.object({
    underwear: z.array(z.string()).default([]),
  }).default({}),
  path: z.string(),
});

const registryUnderwearEntrySchema = z.object({
  name: z.string(),
  version: z.string(),
  description: z.string().default(''),
  path: z.string(),
});

export const registryIndexSchema = z.object({
  version: z.literal(1),
  generatedAt: z.string().datetime(),
  dresses: z.record(z.string(), registryDressEntrySchema).default({}),
  underwear: z.record(z.string(), registryUnderwearEntrySchema).default({}),
});

// ---------------------------------------------------------------------------
// Inferred types
// ---------------------------------------------------------------------------

export type RegistryIndex = z.infer<typeof registryIndexSchema>;
export type RegistryDressEntry = z.infer<typeof registryDressEntrySchema>;
export type RegistryUnderwearEntry = z.infer<typeof registryUnderwearEntrySchema>;
