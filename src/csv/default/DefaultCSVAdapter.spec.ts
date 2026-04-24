import 'reflect-metadata';

import { CSVAdapter } from '../CSVAdapter';
import { DefaultCSVAdapter } from './DefaultCSVAdapter';

const pipeInput = `"lastName"|"firstName"|"phone"
"Suárez"|"Fernanda"|"3143720346"
"Galvis"|"Felisa"|"3202547861"
"Yohana"|"Yohana"|"3208599068"
"Mireya"|"Mireya"|"3138054809"`;

const pipeInputEdgeCase = `lastName|firstName|phone
Suárez|Fernanda|3143720346
Galvis||3202547861
Yohana|Yohana|3208599068
Mireya||3138054809`;

const quoteInput = `id,amount
0000101010,1000000
0002102012,2000000`;

describe('DefaultCSVAdapter Test Suite', () => {
    let adapter: CSVAdapter;

    beforeEach(() => {
        adapter = new DefaultCSVAdapter();
    });

    it('should be defined', () => {
        expect(adapter).toBeDefined();
    });

    describe('test for identifyConfig', () => {
        it('should return success result', async () => {
            const result = adapter.identifyConfig(pipeInput);
            expect(result.result).toEqual({
                delimiter: '|',
                hasQuotes: true,
                header: true
            });
        });
    });

    describe('test for parse', () => {
        it('should return success result with pipe input', async () => {
            const resultConfig = adapter.identifyConfig(pipeInput);
            if (!resultConfig.result) {
                throw new Error('identifyConfig returned null');
            }
            const result = adapter.parse(resultConfig.result, pipeInput);
            expect(result.success).toBe(true);
            expect(result.result[0]).toEqual(
                jasmine.objectContaining({
                    lastName: 'Suárez',
                    firstName: 'Fernanda',
                    phone: '3143720346',
                    __rowNumber: 2
                })
            );
        });
        it('should return success result with pipe input edge case', async () => {
            const resultConfig = adapter.identifyConfig(pipeInputEdgeCase);
            if (!resultConfig.result) {
                throw new Error('identifyConfig returned null');
            }
            const result = adapter.parse(
                resultConfig.result,
                pipeInputEdgeCase
            );
            expect(result.success).toBe(true);
            expect(result.result[1]).toEqual(
                jasmine.objectContaining({
                    lastName: 'Galvis',
                    firstName: '',
                    phone: '3202547861',
                    __rowNumber: 3
                })
            );
        });
        it('should return success result with quote input', async () => {
            const resultConfig = adapter.identifyConfig(quoteInput);
            if (!resultConfig.result) {
                throw new Error('identifyConfig returned null');
            }
            const result = adapter.parse(resultConfig.result, quoteInput);
            expect(result.success).toBe(true);
            expect(result.result[0]).toEqual(
                jasmine.objectContaining({
                    id: '0000101010',
                    amount: '1000000',
                    __rowNumber: 2
                })
            );
        });
        it('should return success result with quote input', async () => {
            const resultConfig = adapter.identifyConfig(quoteInput);
            if (!resultConfig.result) {
                throw new Error('identifyConfig returned null');
            }
            const result = adapter.parse(resultConfig.result, quoteInput);
            expect(result.success).toBe(true);
            expect(result.result[0]).toEqual(
                jasmine.objectContaining({
                    id: '0000101010',
                    amount: '1000000',
                    __rowNumber: 2
                })
            );
        });
    });

    describe('test for export', () => {
        it('should return success result with pipe input', async () => {
            const result = adapter.export(
                [
                    {
                        account: '0000101010',
                        amount: '1000000'
                    }
                ],
                {
                    delimiter: '|',
                    hasQuotes: true,
                    header: true
                }
            );
            const expectedOutput = `"account"|"amount"
"0000101010"|"1000000"`;
            expect(result).toEqual(expectedOutput);
        });
    });
});
