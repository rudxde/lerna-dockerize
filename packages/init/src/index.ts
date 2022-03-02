import type { CommandModule } from 'yargs';
import { IInitArgs } from './args';


export const command: CommandModule<{}, IInitArgs> = {
    command: 'init',
    describe: 'Initialize lerna-dockerize in your project',
    builder: {
        workingDirectory: {
            type: 'string',
            defaultDescription: 'current working directory',
        },
        installAsDevDependency: {
            type: 'boolean',
            default: true,
        },
        packageManager: {
            type: 'string',
            default: 'npm',
            choices: ['npm', 'yarn'],
        },
        templateDockerFileName: {
            type: 'string',
            default: 'Dockerfile.template',
        },
        baseDockerfileName: {
            type: 'string',
            default: 'Dockerfile.base',
        },
        scriptName: {
            type: 'string',
            default: 'lerna-dockerize',
        },
    },
    handler: async (args: IInitArgs) => {
        await (await import('./main')).main(args);
    },
};
