import 'reflect-metadata';

import { NumeralMoneyAdapter } from './NumeralMoneyAdapter';

describe('NumeralMoneyAdapter Test Suite', () => {
    let adapter: NumeralMoneyAdapter;

    beforeEach(() => {
        adapter = new NumeralMoneyAdapter();
    });

    describe('test for toMoneyFormat', () => {
        it('should be defined', () => {
            expect(adapter).toBeDefined();
        });

        it('should format money', async () => {
            expect(adapter.toMoneyFormat(10000)).toEqual('$ 10,000');
        });
    });
});
