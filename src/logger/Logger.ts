/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Logger {
    debug(...args: any[]): void;
    info(...args: any[]): void;
    error(...args: any[]): void;
}

export const COLORS_LOGGER_CONST_TYPE = Symbol('COLORS_LOGGER_CONST_TYPE');
export const TIMEZONE_LOGGER_CONST_TYPE = Symbol('TIMEZONE_LOGGER_CONST_TYPE');
export const LOGGER_TYPE = Symbol.for('LOGGER_TYPE');
