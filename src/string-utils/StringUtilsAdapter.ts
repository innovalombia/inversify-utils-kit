export enum StringCases {
    PASCAL_CASE = 'PASCAL_CASE',
    CAMEL_CASE = 'CAMEL_CASE',
    UPPER_SNAKE_CASE = 'UPPER_SNAKE_CASE',
    LOWER_SNAKE_CASE = 'LOWER_SNAKE_CASE',
    KEBAB_CASE = 'KEBAB_CASE',
    MONEY_CASE = 'MONEY_CASE',
    NUMBER_CASE = 'NUMBER_CASE'
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

export class InvalidStringCase extends StringUtilsAdapterError {}

export interface StringUtilsAdapter {
    toCapitalize(payload: string): string;
    toSimpleCapitalize(word: string): string;
    checkStringCase(word: string): StringCases | null;
    textCaseToArrayString(word: string): string[];
}

export const STRING_UTILS_ADAPTER_TYPE = Symbol('STRING_UTILS_ADAPTER_TYPE');
