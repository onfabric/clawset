import { z } from 'zod';
import { dressIdSchema, semverSchema, pluginDefSchema } from './dress-json.js';

// ---------------------------------------------------------------------------
// underwear.json schema
// ---------------------------------------------------------------------------

export const underwearJsonSchema = z.object({
  id: dressIdSchema,
  name: z.string().min(1),
  version: semverSchema,
  description: z.string().default(''),
  plugins: z.array(pluginDefSchema).default([]),
});

// ---------------------------------------------------------------------------
// Inferred types
// ---------------------------------------------------------------------------

export type UnderwearJson = z.infer<typeof underwearJsonSchema>;
