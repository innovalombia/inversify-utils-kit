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
        it('should return success result for kebab case', async () => {
            const result = adapter.textCaseToAllCases('loan-simple-event');
            expect(result).toEqual({
                camelCase: 'loanSimpleEvent',
                kebabCase: 'loan-simple-event',
                lowerSnakeCase: 'loan_simple_event',
                upperSnakeCase: 'LOAN_SIMPLE_EVENT',
                pascalCase: 'LoanSimpleEvent',
                capitalizeCase: 'Loan simple event',
                lowerCase: 'loan simple event',
                fullCapitalizeCase: 'Loan Simple Event',
                upperCase: 'LOAN SIMPLE EVENT',
                stringCase: StringCases.KEBAB_CASE
            });
        });
        it('should return success result', async () => {
            const result = adapter.textCaseToAllCases('loan_simple_event');
            expect(result).toEqual({
                camelCase: 'loanSimpleEvent',
                kebabCase: 'loan-simple-event',
                lowerSnakeCase: 'loan_simple_event',
                upperSnakeCase: 'LOAN_SIMPLE_EVENT',
                pascalCase: 'LoanSimpleEvent',
                capitalizeCase: 'Loan simple event',
                lowerCase: 'loan simple event',
                fullCapitalizeCase: 'Loan Simple Event',
                upperCase: 'LOAN SIMPLE EVENT',
                stringCase: StringCases.LOWER_SNAKE_CASE
            });
        });

        it('should return success result', async () => {
            const result = adapter.textCaseToAllCases('StringPascalCase');
            expect(result).toEqual({
                camelCase: 'stringPascalCase',
                kebabCase: 'string-pascal-case',
                lowerSnakeCase: 'string_pascal_case',
                upperSnakeCase: 'STRING_PASCAL_CASE',
                pascalCase: 'StringPascalCase',
                capitalizeCase: 'String pascal case',
                lowerCase: 'string pascal case',
                fullCapitalizeCase: 'String Pascal Case',
                upperCase: 'STRING PASCAL CASE',
                stringCase: StringCases.PASCAL_CASE
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
                adapter.checkStringCase('upper case example a');
            }).toThrowError(CannotBeDeterminedStringCase);
        });
    });

    describe('test for textCaseToArrayString', () => {
        it('should transform snake_cases to array', async () => {
            const { arrayString } =
                adapter.textCaseToArrayString('this_is_example');
            expect(arrayString.join(' ')).toBe('this is example');
        });
        it('should identify PascalCase', async () => {
            const { arrayString } = adapter.textCaseToArrayString(
                'SecondExampleWithPascalCase'
            );
            expect(arrayString.join(' ')).toBe(
                'second example with pascal case'
            );
        });
        it('should identify camelCase', async () => {
            const { arrayString } =
                adapter.textCaseToArrayString('camelCaseExample');
            expect(arrayString.join(' ')).toBe('camel case example');
        });
        it('should identify UPPER_CASE', async () => {
            const { arrayString } =
                adapter.textCaseToArrayString('UPPER_CASE_EXAMPLE');
            expect(arrayString.join(' ')).toBe('upper case example');
        });
        it('should identify kebab-case', async () => {
            const { arrayString } = adapter.textCaseToArrayString(
                'default-string-case-and-case'
            );
            expect(arrayString.join(' ')).toBe('default string case and case');
        });
        it('should identify money case', async () => {
            const { arrayString } =
                adapter.textCaseToArrayString('$1,341,000.00');
            expect(arrayString.join(' ')).toBe('$1,341,000.00');
        });
        it('should identify number case', async () => {
            const { arrayString } = adapter.textCaseToArrayString('-341000.00');
            expect(arrayString.join(' ')).toBe('-341000.00');
        });
        it('should no identify case', async () => {
            const { arrayString } = adapter.textCaseToArrayString(
                'upper case example a'
            );
            expect(arrayString.join(' ')).toBe('upper case example a');
        });
    });
});
