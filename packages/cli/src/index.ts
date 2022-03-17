import { getLogger, initLogger, loggerYargsOptions } from '@lerna-dockerize/logger';
import { existsSync, promises } from 'fs';
import yargs, { CommandModule } from 'yargs';

export async function cli(
    commands: CommandModule<{}, any>[],
): Promise<void> {
    let config = {};
    const lernaConfigPath = 'lerna.json';
    try {
        if (existsSync(lernaConfigPath)) {
            const lernaConfigRaw = await (await promises.readFile(lernaConfigPath)).toString();
            const lernaConfig = JSON.parse(lernaConfigRaw);
            config = lernaConfig['lerna-dockerize'] ?? {};
        }
    } catch (err) {
        getLogger().debug(err);
    }
    let builder = yargs
        .config(config)
        .wrap(process.stdout.columns)
        .options(loggerYargsOptions)
        .middleware(async (args) => {
            await initLogger(args);
        });

    for (const command of commands) {
        builder = builder.command(command);
    }

    builder
        .demandCommand()
        .argv;
}

export { CommandModule } from 'yargs';
