import 'reflect-metadata';

import { StringCases } from '../StringUtilsAdapter';
import { DefaultStringUtilsAdapter } from './DefaultStringUtilsAdapter';

describe('DefaultStringUtilsAdapter Test Suite', () => {
    let adapter: DefaultStringUtilsAdapter;

    beforeEach(() => {
        adapter = new DefaultStringUtilsAdapter();
    });

    it('should be defined', () => {
        expect(adapter).toBeDefined();
    });

    describe('test for toCapitalize', () => {
        it('should return success result', async () => {
            const result = adapter.toCapitalize('this is a example');
            expect(result).toBe('This Is A Example');
        });
    });

    describe('test for toSimpleCapitalize', () => {
        it('should return success result', async () => {
            const result = adapter.toSimpleCapitalize('this is a example');
            expect(result).toBe('This is a example');
        });
    });

    describe('test for checkTextCase', () => {
        it('should identify snake_cases', async () => {
            const result = adapter.checkTextCase('this_is_example');
            expect(result).toBe(StringCases.LOWER_SNAKE_CASE);
        });
        it('should identify PascalCase', async () => {
            const result = adapter.checkTextCase('SecondExampleWithPascalCase');
            expect(result).toBe(StringCases.PASCAL_CASE);
        });
        it('should identify camelCase', async () => {
            const result = adapter.checkTextCase('camelCaseExample');
            expect(result).toBe(StringCases.CAMEL_CASE);
        });
        it('should identify UPPER_CASE', async () => {
            const result = adapter.checkTextCase('UPPER_CASE_EXAMPLE');
            expect(result).toBe(StringCases.UPPER_SNAKE_CASE);
        });
        it('should identify kebab-case', async () => {
            const result = adapter.checkTextCase(
                'default-string-case-and-case'
            );
            expect(result).toBe(StringCases.KEBAB_CASE);
        });
        it('should identify money case', async () => {
            const result = adapter.checkTextCase('$1,341,000.00');
            expect(result).toBe(StringCases.MONEY_CASE);
        });
        it('should identify number case', async () => {
            const result = adapter.checkTextCase('-341000.00');
            expect(result).toBe(StringCases.NUMBER_CASE);
        });
        it('should no identify case', async () => {
            const result = adapter.checkTextCase('UPPER_CASE_EXAMPLE_a');
            expect(result).toBe(null);
        });
    });
});
