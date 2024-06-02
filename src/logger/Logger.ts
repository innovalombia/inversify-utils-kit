/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Logger {
    debug(...args: any[]): void;
    info(...args: any[]): void;
    error(...args: any[]): void;
}

export const LOGGER_TYPE = Symbol.for('LOGGER_TYPE');
