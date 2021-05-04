import yargs from 'yargs';

export interface IOptions {
    baseDockerfileName: string;
    templateDockerfileName?: string;
    finalDockerfileName?: string;
    outDockerfileName: string;
    dockerfileWorkingDir: string;
    packageManager: string;
    lernaCommand: string;
    logLevel: string;
    logConsole: boolean;
}

let options: IOptions | undefined;


export function loadOptions(args: string[] = process.argv): IOptions {
    options = yargs
        .option('baseDockerfileName', {
            description: 'The name of the base Dockerfile.',
            type: 'string',
            default: 'Dockerfile.base',
        })
        .option('templateDockerfileName', {
            description: 'The name of the Dockerfile template for all packages.',
            type: 'string',
        })
        .option('finalDockerfileName', {
            description: 'The name for the final stages Dockerfile.',
            type: 'string',
        })
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
        .parse(args);
    return options;
}

export function getOptions(): IOptions {
    if (!options) {
        throw new Error('options not loaded please call loadOptions first!');
    }
    return options;
}
