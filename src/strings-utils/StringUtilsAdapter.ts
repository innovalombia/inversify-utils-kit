export enum StringCases {
    PASCAL_CASE = 'PASCAL_CASE',
    CAMEL_CASE = 'CAMEL_CASE',
    UPPER_SNAKE_CASE = 'UPPER_SNAKE_CASE',
    LOWER_SNAKE_CASE = 'LOWER_SNAKE_CASE',
    KEBAB_CASE = 'KEBAB_CASE',
    MONEY_CASE = 'MONEY_CASE',
    NUMBER_CASE = 'NUMBER_CASE'
}

export interface StringUtilsAdapter {
    toCapitalize(payload: string): string;
    toSimpleCapitalize(word: string): string;
    checkTextCase(word: string): StringCases | null;
}

export const STRING_UTILS_ADAPTER_TYPE = Symbol('STRING_UTILS_ADAPTER_TYPE');
