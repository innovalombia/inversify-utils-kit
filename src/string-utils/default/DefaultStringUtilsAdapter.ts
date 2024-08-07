import { injectable } from 'inversify';

import {
    AllCasesResult,
    CannotBeDeterminedStringCase,
    StringCases,
    StringUtilsAdapter,
    TextToArrayStringResult
} from '../StringUtilsAdapter';

@injectable()
export class DefaultStringUtilsAdapter implements StringUtilsAdapter {
    UPPER_CASE_REGEX = /^[A-Z0-9]+$/;
    LOWER_CASE_REGEX = /^[a-z0-9]+$/;
    CAPITALIZE_CASE_REGEX = /^[A-Z][a-z]*$/;
    PASCAL_CASE_REGEX =
        /^([A-Z0-9]{1,}[a-z0-9]{0,})+([A-Z0-9]{1,}[a-z0-9]{0,})*$/;
    CAMEL_CASE_REGEX = /^[a-z0-9]+([A-Z0-9][a-z0-9]*)*$/;
    LOWER_SNAKE_CASE_REGEX = /^(_)?[a-z0-9]+(_[a-z0-9]{0,})*$/g;
    UPPER_SNAKE_CASE_REGEX = /^(_)?[A-Z0-9]+(_[A-Z0-9]{0,})*$/g;
    KEBAB_CASE_REGEX = /^[a-z0-9]+(-[a-z0-9]{0,})*$/g;
    MONEY_CASE_REGEX = /^\$?\d{1,3}(,\d{3})*(?:\.\d+)?$/g;
    NUMBER_CASE_REGEX = /^-?\d+(\.\d+)?$/g;
    SEPARATED_BY_SPACES_CASE_REGEX = /^(?!.*_)([A-Za-z0-9\- ]+)$/g;

    constructor(
        characterForDecimals: string = '.',
        characterForMills: string = '\\,'
    ) {
        this.MONEY_CASE_REGEX = new RegExp(
            `^\\$?\\d{1,3}(${characterForMills}\\d{3})*(?:${characterForDecimals}\\d+)?$`
        );
    }

    toCapitalize(input: string): string {
        return input
            .toLowerCase()
            .replace(/(^\w{1})|(\s+\w{1})/g, (letter) => letter.toUpperCase());
    }
    toSimpleCapitalize(word: string): string {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }

    private regexToArrayString(input: string, regex: RegExp): string[] {
        return input
            .match(regex)
            .filter(Boolean)
            .map((word: string) => word.toLowerCase());
    }
    private arrayStringToCamelCase(arrayString: string[]): string {
        return arrayString
            .map((word, index) => {
                if (index === 0) {
                    return word;
                }
                return this.toSimpleCapitalize(word);
            })
            .join('');
    }
    private arrayStringToSnakeCase(arrayString: string[]): string {
        return arrayString.join('_');
    }
    private arrayStringToPascalCase(arrayString: string[]): string {
        return arrayString
            .map((word) => this.toSimpleCapitalize(word))
            .join('');
    }
    private arrayStringToKebabCase(arrayString: string[]): string {
        return arrayString.join('-');
    }
    textCaseToCamelCase(word: string): string {
        const { arrayString } = this.textCaseToArrayString(word);
        return this.arrayStringToCamelCase(arrayString);
    }
    textCaseToSnakeCase(word: string, formatUpper = false): string {
        const { arrayString } = this.textCaseToArrayString(word);
        const newWord = this.arrayStringToSnakeCase(arrayString);
        return formatUpper ? newWord.toUpperCase() : newWord;
    }
    textCaseToPascalCase(word: string): string {
        const { arrayString } = this.textCaseToArrayString(word);
        return this.arrayStringToPascalCase(arrayString);
    }
    textCaseToKebabCase(word: string): string {
        const { arrayString } = this.textCaseToArrayString(word);
        return this.arrayStringToKebabCase(arrayString);
    }
    private simpleStringToArrayCase(word: string): string[] {
        return [word.toLowerCase()];
    }
    private undefinedCaseToArrayCase(word: string): string[] {
        return word
            .toLowerCase()
            .split(/[_\s-]+/)
            .map((word) => word.toLowerCase());
    }
    camelCaseToArrayString(word: string): string[] {
        return word
            .match(/([A-Z]?[^A-Z]*)/g)
            .filter(Boolean)
            .map((word: string) => word.toLowerCase());
    }
    snakeCaseToArrayString(word: string): string[] {
        return word
            .toLowerCase()
            .split('_')
            .map((word) => word.toLowerCase());
    }
    pascalCaseToArrayString(word: string): string[] {
        return word.split(/(?=[A-Z])/).map((word) => word.toLowerCase());
    }
    kebabCaseToArrayString(word: string): string[] {
        return word
            .toLowerCase()
            .split('-')
            .map((word) => word.toLowerCase());
    }
    _checkStringCase(word: string): StringCases | null {
        if (word.includes(' ')) {
            return null;
        }

        const caseRegexMap: [RegExp, StringCases][] = [
            [this.CAPITALIZE_CASE_REGEX, StringCases.CAPITALIZE_CASE],
            [this.LOWER_CASE_REGEX, StringCases.LOWER_CASE],
            [this.UPPER_CASE_REGEX, StringCases.UPPER_CASE],
            [this.LOWER_SNAKE_CASE_REGEX, StringCases.LOWER_SNAKE_CASE],
            [this.UPPER_SNAKE_CASE_REGEX, StringCases.UPPER_SNAKE_CASE],
            [this.KEBAB_CASE_REGEX, StringCases.KEBAB_CASE],
            [this.CAMEL_CASE_REGEX, StringCases.CAMEL_CASE],
            [this.PASCAL_CASE_REGEX, StringCases.PASCAL_CASE],
            [this.MONEY_CASE_REGEX, StringCases.MONEY_CASE],
            [this.NUMBER_CASE_REGEX, StringCases.NUMBER_CASE],
            [
                this.SEPARATED_BY_SPACES_CASE_REGEX,
                StringCases.SEPARATED_BY_SPACES_CASE
            ]
        ];

        for (const [regex, stringCase] of caseRegexMap) {
            if (regex.test(word)) {
                return stringCase;
            }
        }
        return null;
    }
    checkStringCase(word: string): StringCases {
        const result = this._checkStringCase(word);
        if (result === null) {
            throw new CannotBeDeterminedStringCase();
        }
        return result;
    }
    _checkLanguageStringCase(word: string): StringCases | null {
        const stringCase = this._checkStringCase(word);
        if (!stringCase || stringCase in [StringCases.SEPARATED_BY_SPACES_CASE])
            return null;
        return stringCase;
    }
    textCaseToArrayString(word: string): TextToArrayStringResult {
        const stringCase = this._checkLanguageStringCase(word);
        if (!stringCase) {
            return {
                arrayString: this.undefinedCaseToArrayCase(word),
                stringCase
            };
        }
        const mapFunctions = {
            [StringCases.CAPITALIZE_CASE]: this.simpleStringToArrayCase,
            [StringCases.UPPER_CASE]: this.simpleStringToArrayCase,
            [StringCases.LOWER_CASE]: this.simpleStringToArrayCase,
            [StringCases.LOWER_SNAKE_CASE]: this.snakeCaseToArrayString,
            [StringCases.UPPER_SNAKE_CASE]: this.snakeCaseToArrayString,
            [StringCases.CAMEL_CASE]: this.camelCaseToArrayString,
            [StringCases.KEBAB_CASE]: this.kebabCaseToArrayString,
            [StringCases.PASCAL_CASE]: this.pascalCaseToArrayString,
            [StringCases.MONEY_CASE]: this.simpleStringToArrayCase,
            [StringCases.NUMBER_CASE]: this.simpleStringToArrayCase
        };
        const handler: (w: string) => string[] =
            mapFunctions[stringCase] || this.undefinedCaseToArrayCase;
        return {
            arrayString: handler(word),
            stringCase
        };
    }
    textCaseToAllCases(word: string): AllCasesResult {
        const { arrayString, stringCase } = this.textCaseToArrayString(word);
        let camelCase: string = '';
        let kebabCase: string = '';
        let lowerSnakeCase: string = '';
        let upperSnakeCase: string = '';
        let pascalCase: string = '';
        let lowerCase: string = '';
        let upperCase: string = '';
        let capitalizeCase: string = '';
        let fullCapitalizeCase: string = '';

        arrayString.forEach((value, index) => {
            const valueUpper = value.toUpperCase();
            const valueCapitalize = this.toSimpleCapitalize(value);
            if (index === 0) {
                camelCase = value;
                kebabCase = value;
                lowerSnakeCase = value;
                upperSnakeCase = valueUpper;
                pascalCase = valueCapitalize;
                lowerCase = value;
                upperCase = valueUpper;
                capitalizeCase = valueCapitalize;
                fullCapitalizeCase = valueCapitalize;
                return;
            }
            camelCase = `${camelCase}${valueCapitalize}`;
            kebabCase = `${kebabCase}-${value}`;
            lowerSnakeCase = `${lowerSnakeCase}_${value}`;
            upperSnakeCase = `${upperSnakeCase}_${valueUpper}`;
            pascalCase = `${pascalCase}${valueCapitalize}`;
            lowerCase = `${lowerCase} ${value}`;
            upperCase = `${upperCase} ${valueUpper}`;
            capitalizeCase = `${capitalizeCase} ${value}`;
            fullCapitalizeCase = `${fullCapitalizeCase} ${valueCapitalize}`;
        });

        return {
            camelCase,
            kebabCase,
            lowerSnakeCase,
            pascalCase,
            upperSnakeCase,
            stringCase,
            lowerCase,
            upperCase,
            capitalizeCase,
            fullCapitalizeCase
        };
    }
}
