import yargs from 'yargs';

export interface IOptions {
    baseDockerfileName: string;
    templateDockerfileName?: string;
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
        .argv;
    return options;
}

export function getOptions(): IOptions {
    if (!options) {
        throw new Error('options not loaded please call loadOptions first!');
    }
    return options;
}
