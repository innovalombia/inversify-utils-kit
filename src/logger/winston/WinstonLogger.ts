/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { inject, injectable, optional } from 'inversify';
import winston, { Logger as LoggerWinston, format } from 'winston';

import {
    COLORS_LOGGER_CONST_TYPE,
    Logger,
    TIMEZONE_LOGGER_CONST_TYPE
} from '../Logger';

const SETTINGS = {
    LOG_LEVEL: 'debug',
    LOCALE_STRING: 'es-CO'
};

@injectable()
export class WinstonLogger implements Logger {
    private LOGGER: LoggerWinston;

    constructor(
        @inject(TIMEZONE_LOGGER_CONST_TYPE)
        @optional()
        private TIMEZONE: string = 'America/Bogota',
        @inject(COLORS_LOGGER_CONST_TYPE)
        @optional()
        COLORS_OUTPUT: boolean = false
    ) {
        const formatters: winston.Logform.Format[] = [
            //this.generateCustomTraceFormat(),
            format.splat(),
            this.generateCustomOrderFormat(),
            format.json({ deterministic: false })
        ];
        if (COLORS_OUTPUT) {
            formatters.push(
                format.colorize({
                    all: true,
                    colors: {
                        error: 'red',
                        warn: 'yellow',
                        info: 'blue',
                        debug: 'green',
                        verbose: 'cyan'
                    }
                })
            );
        }
        this.LOGGER = winston.createLogger({
            level: SETTINGS.LOG_LEVEL,
            format: format.combine(...formatters),
            defaultMeta: {},
            transports: [new winston.transports.Console()]
        });
    }

    private generateCustomOrderFormat(): winston.Logform.Format {
        return format((info) => {
            const { level, message, trace, ...rest } = info;
            const time = new Date().toLocaleString(SETTINGS.LOCALE_STRING, {
                timeZone: this.TIMEZONE,
                year: '2-digit',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
            return {
                level,
                time,
                trace,
                message,
                ...rest
            };
        })();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public debug(...args: any): void {
        this.LOGGER.debug.apply(null, args);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public error(...args: any): void {
        this.LOGGER.error.apply(null, args);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public info(...args: any): void {
        this.LOGGER.info.apply(null, args);
    }
}
