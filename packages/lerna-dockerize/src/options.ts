import yargs from 'yargs';

export interface IOptions {
    baseDockerfileName: string;
    templateDockerfileName?: string;
    dockerfileWorkingDir: string;
}

let options: IOptions | undefined;


export function loadOptions(): IOptions {
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
        .option('dockerfileWorkingDir', {
            description: 'The root working directory for the created dockerfile',
            type: 'string',
            default: '/app/',
        })
        .argv;
    return options;
}

export function getOptions(): IOptions {
    if (!options) {
        throw new Error('options not loaded please call loadOptions first!');
    }
    return options;
}
