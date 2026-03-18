/**
 * Types of data we support for validation in each column
 */
export type CSVColumnType = 'string' | 'number' | 'boolean' | 'date';

export type CSVDelimiter = ',' | ';' | '\t' | '|';

export interface CSVConfig {
    delimiter: CSVDelimiter;
    hasQuotes: boolean;
    header: boolean;
}

export interface ValidationError {
    row: number;
    column: string;
    message: string;
}

/** Result of identifyConfig — only config detection, no data processing */
export interface CSVIdentifyResult {
    success: boolean;
    reasonForInvalidity?: string;
    result: CSVConfig | null;
}

/**
 * Wraps a parsed row with its source rowNumber (1 = header, 2 = first data row).
 * The `__rowNumber` field is a meta field and will be excluded from exports.
 */
export type WithRowNumber<T> = T & { __rowNumber: number };

/**
 * Result of parse — always includes errors (empty if none) and inferredTypes.
 * rowNumber convention: 1 = header row, 2 = first data row.
 */
export interface CSVParseResult<T = any> {
    success: boolean;
    reasonForInvalidity?: string;
    result: WithRowNumber<T>[];
    errors: ValidationError[];
    inferredTypes: Record<string, CSVColumnType>;
}

/**
 * A single match returned by find.
 * rowNumber matches the same convention used in ValidationError (1 = header, 2 = first data row).
 */
export interface CSVFindResult<T = any> {
    rowNumber: number;
    row: T;
    headers: string[];
}

/** Result of updateRow */
export interface CSVUpdateResult<T = any> {
    success: boolean;
    result: T[];
    errors: ValidationError[];
}

export interface CSVAdapter {
    identifyConfig(input: string): CSVIdentifyResult;
    parse<T>(
        config: CSVConfig,
        input: string,
        schema?: Partial<Record<keyof T, CSVColumnType>>
    ): CSVParseResult<T>;
    /**
     * Searches all rows for entries where `key` equals `value`.
     * Returns every match with its rowNumber and the matched header.
     */
    find<T>(
        rows: { [key: string]: any }[],
        keyword: string
    ): CSVFindResult<T>[];
    /**
     * Updates the row at `rowNumber` (2-based, same as parse/find convention)
     * after validating each field in `data` against `inferredTypes`.
     * Returns a new rows array — the original is not mutated.
     */
    updateRow<T>(
        rows: T[],
        rowNumber: number,
        data: Partial<T>,
        inferredTypes: Record<string, CSVColumnType>,
        required?: boolean
    ): CSVUpdateResult<T>;
    export<T>(data: T[], config: CSVConfig): string;
}

export const CSV_ADAPTER_TYPE = Symbol('CSV_ADAPTER_TYPE');
