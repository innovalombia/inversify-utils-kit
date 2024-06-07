import 'reflect-metadata';

import { NumeralMoneyFormatterAdapter } from './NumeralMoneyFormatterAdapter';

describe('NumeralMoneyFormatterAdapter Test Suite', () => {
    let adapter: NumeralMoneyFormatterAdapter;

    beforeEach(() => {
        adapter = new NumeralMoneyFormatterAdapter();
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
