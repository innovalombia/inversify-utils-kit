export type DatesAdapterCurrentDatePlusToLocalDateInput = {
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
};

export class DatesAdapterError extends Error {
    constructor(message: string = 'DatesAdapterError') {
        super(message);
        this.name = this.constructor.name;
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = new Error(message).stack;
        }
    }
}

export class InvalidDateError extends DatesAdapterError {}

export interface DatesAdapter {
    TIMEZONE: string;

    fromDateUTCtoLocalDate(utcDate: string, format?: string): string;
    fromDateISOtoLocalDate(utcDate: string, format?: string): string;
    currentDatePlusToLocalDate(
        payload: DatesAdapterCurrentDatePlusToLocalDateInput,
        format?: string
    ): string;
    now(): number;
    fromFormat(input: string, format: string, isLocal?: boolean): number;
    fromString(input: string): number;
    fromUnix(input: string): { posix: number; type: string };
    toFormat(input: number, format?: string): string;
    toUTC(epoch: number): string;
    toISO(epoch: number): string;
    toUnix(epoch: number): number;
    toLocal(epoch: number): string;
    minus(
        epoch: number,
        payload: DatesAdapterCurrentDatePlusToLocalDateInput
    ): number;
    plus(
        epoch: number,
        payload: DatesAdapterCurrentDatePlusToLocalDateInput
    ): number;
}

export const DATES_ADAPTER_TYPE = Symbol('DATES_ADAPTER_TYPE');
export const LANG_DATES_ADAPTER_CONST_TYPE = Symbol(
    'LANG_DATES_ADAPTER_CONST_TYPE'
);
export const TIMEZONE_DATES_ADAPTER_CONST_TYPE = Symbol(
    'TIMEZONE_DATES_ADAPTER_CONST_TYPE'
);
