import { StringCases, StringUtilsAdapter } from '../StringUtilsAdapter';

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

    private regexToArray(input: string, regex: RegExp): string[] {
        return input
            .match(regex)
            .filter(Boolean)
            .map((word: string) => word.toLowerCase());
    }

    camelCaseToArray(input: string) {
        return this.regexToArray(input, this.CAMEL_CASE_REGEX);
    }

    checkTextCase(word: string): StringCases | null {
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
}
