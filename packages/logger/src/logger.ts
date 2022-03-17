import { createLogger, format, Logger, transports } from 'winston';
import type { TransformableInfo } from 'logform';

let logger: Logger | undefined;

export function initLogger(args: { logLevel: string; logConsole: boolean }): void {
    const formatMessage = (info: TransformableInfo): string => `[${info.timestamp}] ${info.level}: ${info.message}`;
    const formatError = (info: TransformableInfo): string => `${formatMessage(info)}\n\n${info.stack}\n`;

    logger = createLogger({
        level: args.logLevel,
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
    if (args.logConsole) {
        logger = logger.add(new transports.Console());
    }
}

export function getLogger(): Logger {
    if (!logger) {
        initLogger({ logLevel: 'info', logConsole: true });
    }
    return logger!;
}
