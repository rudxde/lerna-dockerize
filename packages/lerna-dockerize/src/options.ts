import { existsSync, promises } from 'fs';
import yargs from 'yargs';
import { getLogger } from './logger';

export interface IOptions {
    baseDockerfileName: string;
    templateDockerfileName?: string;
    finalStage: boolean;
    finalDockerfileName?: string;
    outDockerfileName: string;
    dockerfileWorkingDir: string;
    packageManager: string;
    lernaCommand: string;
    logLevel: string;
    logConsole: boolean;
    hoist: boolean;
    addPrepareStages: boolean;
}

let options: IOptions | undefined;


export async function loadOptions(args: string[] = process.argv): Promise<IOptions> {
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
    options = await yargs
        .config(config)
        .wrap(process.stdout.columns)
        .option('baseDockerfileName', {
            description: 'The name of the base Dockerfile.',
            type: 'string',
            default: 'Dockerfile.base',
        })
        .option('templateDockerfileName', {
            description: 'The name of the Dockerfile template for all packages.',
            type: 'string',
        })
        .option('finalStage', {
            description: 'Should a final stage be added, which combines all packages.',
            type: 'boolean',
            default: true,
        })
        .option('finalDockerfileName', {
            description: 'Dockerfile-Name for custom final stages.',
            type: 'string',
        })
        .implies('finalDockerfileName', 'finalStage')
        .option('outDockerfileName', {
            description: 'Name for where output Dockerfile should be stored.',
            type: 'string',
            default: 'Dockerfile',
        })
        .option('dockerfileWorkingDir', {
            description: 'The root working directory for the created dockerfile',
            type: 'string',
            default: '/app/',
        })
        .option('packageManager', {
            description: 'The package manager used by the project.',
            type: 'string',
            default: 'npm',
            choices: ['npm', 'yarn'],
        })
        .option('lernaCommand', {
            description: 'The command used to call lerna inside the Dockerfile.',
            type: 'string',
            default: 'npx lerna',
        })
        .option('logLevel', {
            description: 'The level which should be logged.',
            type: 'string',
            default: 'info',
            choices: ['info', 'error', 'debug', 'warn'],
        })
        .option('logConsole', {
            description: 'Should be logged to the console',
            type: 'boolean',
            default: true,
        })
        .option('hoist', {
            description: 'Should the --hoist option of lerna be used inside the generated dockerfile',
            type: 'boolean',
            default: false,
        })
        .option('addPrepareStages', {
            description: 'Should stages be split into extra prepare stage.',
            type: 'boolean',
            default: false,
        })
        .parse(args);
    return options;
}

export function getOptions(): IOptions {
    if (!options) {
        throw new Error('options not loaded please call loadOptions first!');
    }
    return options;
}
