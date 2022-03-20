import type { CommandModule } from '@lerna-dockerize/cli';
import { IGenerateArgs } from './args';

export const generateCommand: CommandModule<any, IGenerateArgs> = {
    command: 'generate',
    describe: 'Generates the lerna-dockerize dockerfile',
    builder: {
        baseDockerfileName:  {
            description: 'The name of the base Dockerfile.',
            type: 'string',
            default: 'Dockerfile.base',
        },
        templateDockerfileName:  {
            description: 'The name of the Dockerfile template for all packages.',
            type: 'string',
        },
        finalStage:  {
            description: 'Should a final stage be added, which combines all packages.',
            type: 'boolean',
            default: true,
        },
        finalDockerfileName:  {
            description: 'Dockerfile-Name for custom final stages.',
            type: 'string',
            implies: 'finalStage',
        },
        outDockerfileName:  {
            description: 'Name for where output Dockerfile should be stored.',
            type: 'string',
            default: 'Dockerfile',
        },
        dockerfileWorkingDir:  {
            description: 'The root working directory for the created dockerfile',
            type: 'string',
            default: '/app/',
        },
        packageManager:  {
            description: 'The package manager used by the project.',
            type: 'string',
            default: 'npm',
            choices: ['npm', 'yarn'],
        },
        lernaCommand:  {
            description: 'The command used to call lerna inside the Dockerfile.',
            type: 'string',
            default: 'npx lerna',
        },
        hoist:  {
            description: 'Should the --hoist option of lerna be used inside the generated dockerfile',
            type: 'boolean',
            default: false,
        },
        addPrepareStages:  {
            description: 'Should stages be split into extra prepare stage.',
            type: 'boolean',
            default: false,
        },
    },
    handler: async (args: IGenerateArgs) => {
        await (await import('./main')).main(args);
    },
};

