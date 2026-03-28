import { execute } from '@oclif/core';

import DiffCommand from './commands/diff.js';
import DoctorCommand from './commands/doctor.js';
import DressCommand from './commands/dress.js';
import InitCommand from './commands/init.js';
import LingerieListCommand from './commands/lingerie/list.js';
import LingerieRemoveCommand from './commands/lingerie/remove.js';
import LogCommand from './commands/log.js';
import ParamsCommand from './commands/params.js';
import RollbackCommand from './commands/rollback.js';
import StatusCommand from './commands/status.js';
import UndressCommand from './commands/undress.js';
import WardrobeCommand from './commands/wardrobe.js';

// Exported for oclif's explicit command-loading strategy.
// Set synchronously so the export is live before the first await,
// meaning oclif can read it when it re-imports this bundle to discover commands.
export const COMMANDS = {
  diff: DiffCommand,
  doctor: DoctorCommand,
  dress: DressCommand,
  init: InitCommand,
  'lingerie list': LingerieListCommand,
  'lingerie remove': LingerieRemoveCommand,
  log: LogCommand,
  params: ParamsCommand,
  rollback: RollbackCommand,
  status: StatusCommand,
  undress: UndressCommand,
  wardrobe: WardrobeCommand,
};

export async function run() {
  await execute({ dir: import.meta.url });
}
