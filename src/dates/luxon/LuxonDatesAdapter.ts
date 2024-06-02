import { injectable } from 'inversify';
import { DateTime } from 'luxon';

import {
    DatesAdapter,
    DatesAdapterCurrentDatePlusToLocalDateInput
} from '../DatesAdapter';

const SETTINGS = {
    DEFAULT_DATE_FORMAT: 'yyyy-MM-dd HH:mm'
};

@injectable()
export class LuxonDatesAdapter implements DatesAdapter {
    timeZone: string;
    lang: string;
    constructor(timeZone: string = 'America/Bogota', lang: string = 'es') {
        this.timeZone = timeZone;
        this.lang = lang;
    }
    static instance = new LuxonDatesAdapter();

    fromUnix(input: string): { posix: number; type: string } {
        if (!/^\d{10}(?:\d{3})?(?:\d{9})?$/.test(input)) {
            throw new Error(
                'Invalid posix, posix should be have a number with 10, 13 or 19 digits'
            );
        }
        let base = Number(input);
        let type = 'milliseconds';

        if (input.length === 10) {
            base = base * 1000;
            type = 'seconds';
        } else if (input.length === 19) {
            base = base / 1000000;
            type = 'nanoseconds';
        }
        const date = new Date(base);
        const time = DateTime.fromJSDate(date);
        if (!time.isValid) {
            throw new Error('Invalid date');
        }
        return {
            posix: time.toMillis(),
            type
        };
    }

    toUTC(epoch: number): string {
        return DateTime.fromMillis(epoch).toUTC().toISO();
    }

    toLocal(epoch: number): string {
        return DateTime.fromMillis(epoch).setLocale(this.timeZone).toISO();
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

    fromUTC(date: string): number {
        return DateTime.fromJSDate(new Date(date)).toMillis();
    }
    fromString(date: string): number {
        const dateTime = DateTime.fromJSDate(new Date(date));
        return dateTime.toMillis();
    }

    fromISO(date: string): number {
        return DateTime.fromISO(date).toMillis();
    }

    toFormat(epoch: number, format = SETTINGS.DEFAULT_DATE_FORMAT): string {
        return DateTime.fromMillis(epoch).setLocale(this.lang).toFormat(format);
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
