import 'reflect-metadata';

import { Settings } from 'luxon';

import { LuxonDatesAdapter } from './LuxonDatesAdapter';

describe('LuxonDatesAdapter Test Suite', () => {
    let adapter: LuxonDatesAdapter;

    beforeEach(() => {
        adapter = new LuxonDatesAdapter();
    });

    it('should be defined', () => {
        expect(adapter).toBeDefined();
    });

    describe('test for fromDateUTCtoLocalDate', () => {
        it('should parse to utc to local format date', async () => {
            const result = adapter.fromDateUTCtoLocalDate(
                '2024-02-01T14:00:00.000Z',
                'yyyy-MM-dd'
            );
            expect(result).toBeTruthy();
            expect(result !== 'Invalid DateTime').toBeTruthy();
            expect(result).toBe('2024-02-01');
        });
    });

    describe('test for fromDateISOtoLocalDate', () => {
        it('should parse to iso to local format date', async () => {
            const result = adapter.fromDateISOtoLocalDate(
                '2024-02-01T09:00:00.000-05:00'
            );
            expect(result).toBeTruthy();
            expect(result !== 'Invalid DateTime').toBeTruthy();
        });
    });

    describe('test for fromFormat', () => {
        it('should parse from format in utc', async () => {
            const result = adapter.fromFormat(
                '2024-02-01 09:00:00',
                'yyyy-MM-dd HH:mm:ss'
            );
            expect(result).toBe(1706778000000);
        });
        it('should parse from format in local', async () => {
            const result = adapter.fromFormat(
                '2024-02-01 09:00:00',
                'yyyy-MM-dd HH:mm:ss',
                true
            );
            expect(result).toBe(1706796000000);
        });
    });

    describe('test for toFormat and toLocal with an explicit timezone', () => {
        // Regression: toFormat/toLocal must honor `this.TIMEZONE` instead of
        // the process/system timezone. These tests force Luxon's default
        // zone to UTC (as it would be on a CI runner) so the assertions
        // don't depend on the machine's own local timezone.
        const epoch = 1757178720000; // 2025-09-06T17:12:00.000Z

        let originalDefaultZone: string;

        beforeEach(() => {
            originalDefaultZone = Settings.defaultZone.name;
            Settings.defaultZone = 'utc';
            adapter = new LuxonDatesAdapter('America/Bogota', 'es');
        });

        afterEach(() => {
            Settings.defaultZone = originalDefaultZone;
        });

        it('should format the epoch using the injected timezone, not the system one', () => {
            const result = adapter.toFormat(epoch, 'dd/MM/yyyy HH:mm:ss');
            expect(result).toBe('06/09/2025 12:12:00');
        });

        it('should convert the epoch to ISO using the injected timezone, not the system one', () => {
            const result = adapter.toLocal(epoch);
            expect(result).toBe('2025-09-06T12:12:00.000-05:00');
        });
    });
});
