import type { CommandModule } from '@lerna-dockerize/cli';
import { IInitArgs } from './args';


export const initCommand: CommandModule<{}, IInitArgs> = {
    command: 'init',
    describe: 'Initialize lerna-dockerize in your project',
    builder: {
        workingDirectory: {
            description: 'The working directory to run the command in',
            type: 'string',
            defaultDescription: 'current working directory',
        },
        installAsDevDependency: {
            description: 'Install as devDependency',
            type: 'boolean',
            default: true,
        },
        packageManager: {
            description: 'The package manager to use',
            type: 'string',
            default: 'npm',
            choices: ['npm', 'yarn'],
        },
        templateDockerFileName: {
            description: 'The name for the template Dockerfile',
            type: 'string',
            default: 'Dockerfile.template',
        },
        baseDockerfileName: {
            description: 'The name for the base Dockerfile',
            type: 'string',
            default: 'Dockerfile.base',
        },
        scriptName: {
            description: 'The name for the script added to package.json',
            type: 'string',
            default: 'lerna-dockerize',
        },
    },
    handler: async (args: IInitArgs) => {
        await (await import('./main')).main(args);
    },
};
