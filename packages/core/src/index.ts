// Old schemas (still used by merge.ts, dresscode.ts, state.ts, openclaw.ts)
export {
  dressIdSchema,
  cronExpressionSchema,
  semverSchema,
  paramDefSchema,
  secretDefSchema,
  cronDefSchema,
  pluginDefSchema,
  memoryContractSchema,
  requiresSchema,
  dressFilesSchema,
  resolvedDressSchema,
  appliedCronSchema,
  appliedStateSchema,
  dressEntrySchema,
  underwearDefSchema,
  underwearAppliedSchema,
  underwearEntrySchema,
  stateFileSchema,
  clawsetConfigSchema,
} from './schema.js';

export type {
  DressId,
  CronDef,
  PluginDef,
  MemoryContract,
  Requires,
  SecretDef,
  DressFiles,
  ResolvedDress,
  AppliedCron,
  AppliedState,
  DressEntry,
  UnderwearDef,
  UnderwearApplied,
  UnderwearEntry,
  StateFile,
  ClawsetConfig,
} from './schema.js';

// DRESSCODE generation
export { generateDresscode } from './dresscode.js';

// Merge and diff
export { mergeDresses, diffState } from './merge.js';
export type { MergeConflict, DesiredState, StateDiff } from './merge.js';

// Dependency graph
export { DependencyGraph } from './graph.js';

// Memory utilities
export {
  wrapSection,
  extractSections,
  stripMarkers,
  removeSection,
  findDressMarkers,
  buildMemoryScaffold,
} from './memory.js';

// Cron utilities
export { cronFromTime, addHours } from './cron-utils.js';

// Driver interface
export type { OpenClawDriver, CronListEntry, PluginConfigSchema } from './driver.js';

// New JSON-based schemas
export {
  dressJsonSchema,
  cronJsonSchema,
  skillJsonSchema,
  skillParamSchema,
  underwearJsonSchema,
  registryIndexSchema,
} from './schemas/index.js';

export type {
  DressJson,
  CronJson,
  SkillJson,
  SkillParam,
  Weekday,
  UnderwearJson,
  RegistryIndex,
  RegistryDressEntry,
  RegistryUnderwearEntry,
  DressEntry as DressEntryV2,
  UnderwearEntry as UnderwearEntryV2,
  StateFile as StateFileV2,
  ClawsetConfig as ClawsetConfigV2,
} from './schemas/index.js';
