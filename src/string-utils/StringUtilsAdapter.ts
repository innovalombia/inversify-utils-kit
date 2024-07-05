export enum StringCases {
    CAPITALIZE_CASE = 'CAPITALIZE_CASE',
    LOWER_CASE = 'LOWER_CASE',
    UPPER_CASE = 'UPPER_CASE',
    PASCAL_CASE = 'PASCAL_CASE',
    CAMEL_CASE = 'CAMEL_CASE',
    UPPER_SNAKE_CASE = 'UPPER_SNAKE_CASE',
    LOWER_SNAKE_CASE = 'LOWER_SNAKE_CASE',
    KEBAB_CASE = 'KEBAB_CASE',
    MONEY_CASE = 'MONEY_CASE',
    NUMBER_CASE = 'NUMBER_CASE',
    SEPARATED_BY_SPACES_CASE = 'SEPARATED_BY_SPACES_CASE'
}

export class StringUtilsAdapterError extends Error {
    constructor(message: string = 'StringUtilsAdapterError') {
        super(message);
        this.name = this.constructor.name;
        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        } else {
            this.stack = new Error(message).stack;
        }
    }
}

export class InvalidStringCase extends StringUtilsAdapterError {
    constructor(message: string = 'InvalidStringCase') {
        super(message);
    }
}

export class CannotBeDeterminedStringCase extends StringUtilsAdapterError {
    constructor(message: string = 'CannotBeDeterminedStringCase') {
        super(message);
    }
}

export interface TextToArrayStringResult {
    stringCase: StringCases | null;
    arrayString: string[];
}

export interface AllCasesResult {
    camelCase: string;
    kebabCase: string;
    lowerSnakeCase: string;
    upperSnakeCase: string;
    pascalCase: string;
    lowerCase: string;
    upperCase: string;
    capitalizeCase: string;
    fullCapitalizeCase: string;
    stringCase: StringCases | null;
}

export interface StringUtilsAdapter {
    toCapitalize(payload: string): string;
    toSimpleCapitalize(word: string): string;
    checkStringCase(word: string): StringCases | null;
    textCaseToArrayString(word: string): TextToArrayStringResult;
    camelCaseToArrayString(word: string): string[];
    snakeCaseToArrayString(word: string): string[];
    pascalCaseToArrayString(word: string): string[];
    kebabCaseToArrayString(word: string): string[];
    textCaseToCamelCase(word: string): string;
    textCaseToSnakeCase(word: string, formatUpper?: boolean): string;
    textCaseToPascalCase(word: string): string;
    textCaseToKebabCase(word: string): string;
    textCaseToAllCases(word: string): AllCasesResult;
}

export const STRING_UTILS_ADAPTER_TYPE = Symbol('STRING_UTILS_ADAPTER_TYPE');
