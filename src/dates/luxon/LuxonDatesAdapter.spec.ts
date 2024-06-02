import 'reflect-metadata';

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
});
