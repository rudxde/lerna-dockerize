import { ILoggerArgs } from './args';
import { OptionsOf } from './options-of';

export const loggerYargsOptions: OptionsOf<ILoggerArgs> = {
    logLevel:  {
        description: 'The level which should be logged.',
        type: 'string',
        default: 'info',
        choices: ['info', 'error', 'debug', 'warn'],
    },
    logConsole:  {
        description: 'Should be logged to the console',
        type: 'boolean',
        default: true,
    },
};

export * from './args';
export * from './logger';
export * from './options-of';
