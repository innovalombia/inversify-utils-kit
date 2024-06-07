import { injectable } from 'inversify';

import { StringCases, StringUtilsAdapter } from '../StringUtilsAdapter';

@injectable()
export class DefaultStringUtilsAdapter implements StringUtilsAdapter {
    PASCAL_CASE_REGEX = /^([A-Z]{1,}[a-z]{0,})+([A-Z]{1,}[a-z]{0,})*$/;
    CAMEL_CASE_REGEX = /^[a-z]+([A-Z][a-z]*)*$/;
    LOWER_SNAKE_CASE_REGEX = /^(_)?[a-z]+(_[a-z]+)*$/g;
    UPPER_SNAKE_CASE_REGEX = /^(_)?[A-Z]+(_[A-Z]+)*$/g;
    KEBAB_CASE_REGEX = /^[a-z]+(-[a-z]+)*$/g;
    MONEY_CASE_REGEX = /^\$?\d{1,3}(,\d{3})*(?:\.\d+)?$/g;
    NUMBER_CASE_REGEX = /^-?\d+(\.\d+)?$/g;

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

    private wordToWord(word: string): string[] {
        return [word];
    }

    private regexToArrayString(input: string, regex: RegExp): string[] {
        return input
            .match(regex)
            .filter(Boolean)
            .map((word: string) => word.toLowerCase());
    }

    camelCaseToArrayString(word: string) {
        return word
            .match(/([A-Z]?[^A-Z]*)/g)
            .filter(Boolean)
            .map((word: string) => word.toLowerCase());
    }

    snakeCaseToArrayString(word: string) {
        return word
            .toLowerCase()
            .split('_')
            .map((word) => word.toLowerCase());
    }

    pascalCaseToArrayString(word: string) {
        return word.split(/(?=[A-Z])/).map((word) => word.toLowerCase());
    }
    kebabCaseToArrayString(word: string) {
        return word
            .toLowerCase()
            .split('-')
            .map((word) => word.toLowerCase());
    }

    checkStringCase(word: string): StringCases | null {
        if (word.includes(' ')) {
            return null;
        }

        const caseRegexMap: [RegExp, StringCases][] = [
            [this.LOWER_SNAKE_CASE_REGEX, StringCases.LOWER_SNAKE_CASE],
            [this.UPPER_SNAKE_CASE_REGEX, StringCases.UPPER_SNAKE_CASE],
            [this.KEBAB_CASE_REGEX, StringCases.KEBAB_CASE],
            [this.CAMEL_CASE_REGEX, StringCases.CAMEL_CASE],
            [this.PASCAL_CASE_REGEX, StringCases.PASCAL_CASE],
            [this.MONEY_CASE_REGEX, StringCases.MONEY_CASE],
            [this.NUMBER_CASE_REGEX, StringCases.NUMBER_CASE]
        ];

        for (const [regex, stringCase] of caseRegexMap) {
            if (regex.test(word)) {
                return stringCase;
            }
        }
        return null;
    }

    _checkLanguageStringCase(word: string): StringCases | null {
        const stringCase = this.checkStringCase(word);
        if (!stringCase || stringCase in [StringCases.MONEY_CASE]) return null;
        return stringCase;
    }

    textCaseToArrayString(word: string): string[] {
        const stringCase = this._checkLanguageStringCase(word);
        const mapFunctions = {
            [StringCases.LOWER_SNAKE_CASE]: this.snakeCaseToArrayString,
            [StringCases.UPPER_SNAKE_CASE]: this.snakeCaseToArrayString,
            [StringCases.CAMEL_CASE]: this.camelCaseToArrayString,
            [StringCases.KEBAB_CASE]: this.kebabCaseToArrayString,
            [StringCases.PASCAL_CASE]: this.pascalCaseToArrayString
        };
        const handler: (w: string) => string[] =
            mapFunctions[stringCase] || this.wordToWord;
        return handler(word);
    }
}
