import { Flags } from '@oclif/core';
import chalk from 'chalk';
import { BaseCommand } from '#base.ts';
import { createRegistryProvider } from '#lib/registry.ts';

export default class DressList extends BaseCommand {
  static override summary = 'List available dresses from the registry';

  static override examples = ['<%= config.bin %> dress'];

  static override flags = {
    ...BaseCommand.baseFlags,
    json: Flags.boolean({
      description: 'Output as JSON',
      default: false,
    }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(DressList);
    await this.loadConfig();

    const registry = createRegistryProvider(process.cwd(), this.clawtiquePaths.cache);
    const index = await registry.getIndex();
    const state = await this.stateManager.load();
    const activeIds = new Set(Object.keys(state.dresses));

    const entries = Object.entries(index.dresses);

    if (flags.json) {
      const result = entries.map(([id, entry]) => ({
        id,
        ...entry,
        active: activeIds.has(id),
      }));
      this.log(JSON.stringify(result, null, 2));
      return;
    }

    if (entries.length === 0) {
      this.log('\nNo dresses available in the registry.\n');
      return;
    }

    this.log(`\n${chalk.bold('Dresses')}\n`);

    for (const [id, entry] of entries) {
      const active = activeIds.has(id);
      const version = state.dresses[id]?.version ?? entry.version;
      const status = active ? chalk.green(' (active)') : '';
      const marker = active ? chalk.green('●') : chalk.dim('○');

      this.log(`  ${marker} ${chalk.cyan(entry.name)} ${chalk.dim(`${id} v${version}`)}${status}`);
      if (entry.description) {
        this.log(`    ${chalk.dim(entry.description)}`);
      }
    }

    this.log('');
    this.log(
      chalk.dim(
        `  ${entries.length} dress${entries.length === 1 ? '' : 'es'} | ${activeIds.size} active`,
      ),
    );
    this.log('');
  }
}
