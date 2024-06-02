export type DatesAdapterCurrentDatePlusToLocalDateInput = {
    days?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
};

export interface DatesAdapter {
    fromDateUTCtoLocalDate(utcDate: string, format?: string): string;
    fromDateISOtoLocalDate(utcDate: string, format?: string): string;
    currentDatePlusToLocalDate(
        payload: DatesAdapterCurrentDatePlusToLocalDateInput,
        format?: string
    ): string;
    now(): number;
    fromString(input: string): number;
    fromUnix(input: string): { posix: number; type: string };
    toUnix(epoch: number): number;
    toFormat(input: number, format?: string): string;
    toUTC(epoch: number): string;
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
