import 'reflect-metadata';

import {
    CannotBeDeterminedStringCase,
    StringCases
} from '../StringUtilsAdapter';
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
    describe('test for textCaseToAllCases', () => {
        it('should return success result', async () => {
            const result = adapter.textCaseToAllCases('loan-simple-event');
            expect(result).toEqual({
                camelCase: 'loanSimpleEvent',
                kebabCase: 'loan-simple-event',
                lowerSnakeCase: 'loan_simple_event',
                upperSnakeCase: 'LOAN_SIMPLE_EVENT',
                pascalCase: 'LoanSimpleEvent'
            });
        });
    });

    describe('test for checkStringCase', () => {
        it('should identify snake_cases', async () => {
            const result = adapter.checkStringCase('this_is_example');
            expect(result).toBe(StringCases.LOWER_SNAKE_CASE);
        });
        it('should identify PascalCase', async () => {
            const result = adapter.checkStringCase(
                'SecondExampleWithPascalCase'
            );
            expect(result).toBe(StringCases.PASCAL_CASE);
        });
        it('should identify camelCase', async () => {
            const result = adapter.checkStringCase('camelCaseExample');
            expect(result).toBe(StringCases.CAMEL_CASE);
        });
        it('should identify UPPER_CASE', async () => {
            const result = adapter.checkStringCase('UPPER_CASE_EXAMPLE');
            expect(result).toBe(StringCases.UPPER_SNAKE_CASE);
        });
        it('should identify kebab-case', async () => {
            const result = adapter.checkStringCase(
                'default-string-case-and-case'
            );
            expect(result).toBe(StringCases.KEBAB_CASE);
        });
        it('should identify money case', async () => {
            const result = adapter.checkStringCase('$1,341,000.00');
            expect(result).toBe(StringCases.MONEY_CASE);
        });
        it('should identify number case', async () => {
            const result = adapter.checkStringCase('-341000.00');
            expect(result).toBe(StringCases.NUMBER_CASE);
        });
        it('should no identify case', async () => {
            expect(() => {
                adapter.checkStringCase('UPPER_CASE_EXAMPLE_a');
            }).toThrowError(CannotBeDeterminedStringCase);
        });
    });

    describe('test for textCaseToArrayString', () => {
        it('should transform snake_cases to array', async () => {
            const result = adapter.textCaseToArrayString('this_is_example');
            expect(result.join(' ')).toBe('this is example');
        });
        it('should identify PascalCase', async () => {
            const result = adapter.textCaseToArrayString(
                'SecondExampleWithPascalCase'
            );
            expect(result.join(' ')).toBe('second example with pascal case');
        });
        it('should identify camelCase', async () => {
            const result = adapter.textCaseToArrayString('camelCaseExample');
            expect(result.join(' ')).toBe('camel case example');
        });
        it('should identify UPPER_CASE', async () => {
            const result = adapter.textCaseToArrayString('UPPER_CASE_EXAMPLE');
            expect(result.join(' ')).toBe('upper case example');
        });
        it('should identify kebab-case', async () => {
            const result = adapter.textCaseToArrayString(
                'default-string-case-and-case'
            );
            expect(result.join(' ')).toBe('default string case and case');
        });
        it('should identify money case', async () => {
            const result = adapter.textCaseToArrayString('$1,341,000.00');
            expect(result.join(' ')).toBe('$1,341,000.00');
        });
        it('should identify number case', async () => {
            const result = adapter.textCaseToArrayString('-341000.00');
            expect(result.join(' ')).toBe('-341000.00');
        });
        it('should no identify case', async () => {
            const result = adapter.textCaseToArrayString(
                'UPPER_CASE_EXAMPLE_a'
            );
            expect(result.join(' ')).toBe('UPPER_CASE_EXAMPLE_a');
        });
    });
});
