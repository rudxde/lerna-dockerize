import { getLogger, initLogger, loggerYargsOptions } from '@lerna-dockerize/logger';
import { existsSync, promises } from 'fs';
import yargs, { CommandModule } from 'yargs';

export type { CommandModule } from 'yargs';

export async function cli(
    commands: CommandModule<{}, any>[],
    defaultCommand: string,
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
        let yargsCommand: CommandModule<{}, any> = command;
        if (command.command) {
            if (typeof command.command === 'string' && command.command === defaultCommand) {
                yargsCommand.command = [command.command, '$0'];
            }
            if (Array.isArray(command.command) && command.command[0] === defaultCommand) {
                yargsCommand.command = [...command.command, '$0'];
            }
        }
        builder = builder.command(yargsCommand);
    }

    builder
        .demandCommand()
        .argv;
}
