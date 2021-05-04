import { createLogger, format, Logger, transports } from 'winston';
import type { TransformableInfo } from 'logform';
import { getOptions } from './options';

let logger: Logger | undefined;


export function getLogger(): Logger {
    if (!logger) {

        const formatMessage = (info: TransformableInfo): string => `[${info.timestamp}] ${info.level}: ${info.message}`;
        const formatError = (info: TransformableInfo): string => `${formatMessage(info)}\n\n${info.stack}\n`;

        logger = createLogger({
            level: getOptions().logLevel,
            format: format.combine(
                format.timestamp(),
                format.colorize(),
                format.printf((info: TransformableInfo) => {
                    if (info instanceof Error) {
                        return formatError(info);
                    } else {
                        return formatMessage(info);
                    }
                }),
            ),
        });
        if (getOptions().logConsole) {
            logger = logger.add(new transports.Console());
        }
    }
    return logger;
}
