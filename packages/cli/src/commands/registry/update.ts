import { existsSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import chalk from 'chalk';
import { BaseCommand } from '#base.ts';

export default class RegistryUpdate extends BaseCommand {
  static override summary = 'Pull the latest registry from GitHub';

  static override examples = ['<%= config.bin %> registry update'];

  async run(): Promise<void> {
    await this.parse(RegistryUpdate);
    await this.loadConfig();

    const cacheDir = this.clawtiquePaths.cache;
    if (existsSync(cacheDir)) {
      await rm(cacheDir, { recursive: true });
    }

    this.log(`${chalk.green('✓')} Registry cache cleared. Next command will fetch the latest.`);
  }
}
