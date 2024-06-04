/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import 'reflect-metadata';

import { inject, injectable, optional } from 'inversify';
import { DateTime } from 'luxon';

import {
    DatesAdapter,
    DatesAdapterCurrentDatePlusToLocalDateInput,
    InvalidDateError,
    LANG_DATES_ADAPTER_CONST_TYPE,
    TIMEZONE_DATES_ADAPTER_CONST_TYPE
} from '../DatesAdapter';

const SETTINGS = {
    DEFAULT_DATE_FORMAT: 'yyyy-MM-dd HH:mm'
};

@injectable()
export class LuxonDatesAdapter implements DatesAdapter {
    constructor(
        @inject(TIMEZONE_DATES_ADAPTER_CONST_TYPE)
        @optional()
        public TIMEZONE: string = 'America/Bogota',
        @inject(LANG_DATES_ADAPTER_CONST_TYPE)
        @optional()
        private LANG: string = 'es'
    ) {}

    fromUnix(input: string): { posix: number; type: string } {
        if (!/^\d{10}(?:\d{3})?(?:\d{6})?(?:\d{9})?$/.test(input)) {
            throw new Error(
                'Invalid posix, posix should be have a number with 10, 13, 16 or 19 digits'
            );
        }
        let base = Number(input);
        let type = 'milliseconds';

        if (input.length === 10) {
            base = base * 1000;
            type = 'seconds';
        }
        if (input.length === 16) {
            base = base / 1000;
            type = 'microseconds';
        } else if (input.length === 19) {
            base = base / 1000000;
            type = 'nanoseconds';
        }
        const date = new Date(base);
        const dateTime = DateTime.fromJSDate(date);
        if (!dateTime.isValid) {
            throw new InvalidDateError();
        }
        return {
            posix: dateTime.toMillis(),
            type
        };
    }

    toUTC(epoch: number): string {
        return DateTime.fromMillis(epoch).toUTC().toISO();
    }

    toLocal(epoch: number): string {
        return DateTime.fromMillis(epoch).setLocale(this.TIMEZONE).toISO();
    }

    fromDateUTCtoLocalDate(
        utcDate: string,
        format = SETTINGS.DEFAULT_DATE_FORMAT
    ): string {
        return this.toFormat(this.fromString(utcDate), format);
    }

    fromDateISOtoLocalDate(
        utcDate: string,
        format = SETTINGS.DEFAULT_DATE_FORMAT
    ): string {
        return this.toFormat(this.fromISO(utcDate), format);
    }

    currentDatePlusToLocalDate(
        payload: DatesAdapterCurrentDatePlusToLocalDateInput,
        format = SETTINGS.DEFAULT_DATE_FORMAT
    ): string {
        return this.toFormat(this.plus(this.now(), payload), format);
    }

    now(): number {
        return DateTime.now().toMillis();
    }

    fromFormat(input: string, format: string, isLocal = false): number {
        let dateTime = DateTime.fromFormat(input, format, {
            zone: isLocal ? this.TIMEZONE : 'UTC'
        });
        console.log(dateTime);
        if (!dateTime.isValid) {
            throw new InvalidDateError();
        }
        if (isLocal) {
            dateTime = dateTime.setZone(this.TIMEZONE);
        }
        return dateTime.toMillis();
    }

    fromString(date: string): number {
        const dateTime = DateTime.fromJSDate(new Date(date));
        if (!dateTime.isValid) {
            throw new InvalidDateError();
        }
        return dateTime.toMillis();
    }

    fromISO(date: string): number {
        const dateTime = DateTime.fromISO(date);
        if (!dateTime.isValid) {
            throw new InvalidDateError();
        }
        return dateTime.toMillis();
    }

    toFormat(epoch: number, format = SETTINGS.DEFAULT_DATE_FORMAT): string {
        return DateTime.fromMillis(epoch).setLocale(this.LANG).toFormat(format);
    }

    toISO(epoch: number): string {
        return DateTime.fromMillis(epoch).toISO();
    }

    toUnix(epoch: number): number {
        return DateTime.fromMillis(epoch).toUnixInteger();
    }

    plus(
        epoch: number,
        payload: DatesAdapterCurrentDatePlusToLocalDateInput
    ): number {
        return DateTime.fromMillis(epoch).plus(payload).toMillis();
    }

    minus(
        epoch: number,
        payload: DatesAdapterCurrentDatePlusToLocalDateInput
    ): number {
        return DateTime.fromMillis(epoch).minus(payload).toMillis();
    }
}
