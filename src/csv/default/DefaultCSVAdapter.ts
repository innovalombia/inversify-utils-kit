import {
    CSVAdapter,
    CSVColumnType,
    CSVConfig,
    CSVDelimiter,
    CSVFindResult,
    CSVIdentifyResult,
    CSVParseResult,
    CSVUpdateResult,
    ValidationError,
    WithRowNumber
} from '../CSVAdapter';

export class DefaultCSVAdapter implements CSVAdapter {
    /**
     * Identifies the delimiter by counting occurrences in the first few lines.
     * It also checks if the file is likely a binary file.
     */
    identifyConfig(input: string): CSVIdentifyResult {
        if (input.includes('\0')) {
            return {
                success: false,
                reasonForInvalidity:
                    'Binary file detected. Please upload a valid text CSV.',
                result: null
            };
        }

        const delimiters: CSVDelimiter[] = [',', ';', '\t', '|'];
        const lines = input.split('\n').slice(0, 5);

        let bestDelimiter: CSVDelimiter = ',';
        let maxCount = -1;

        delimiters.forEach((d) => {
            const count = lines[0].split(d).length;
            if (count > maxCount && count > 1) {
                maxCount = count;
                bestDelimiter = d;
            }
        });

        return {
            success: true,
            result: {
                delimiter: bestDelimiter,
                hasQuotes: input.includes('"'),
                header: true
            }
        };
    }

    private inferValueType(value: string): CSVColumnType {
        if (!value) return 'string';

        // Leading zero: "01889381" must be treated as string
        if (/^0\d+/.test(value)) return 'string';

        // Boolean: exact matches only
        if (['true', 'false', '1', '0'].includes(value.toLowerCase()))
            return 'boolean';

        // Number
        const num = Number(value);
        if (!isNaN(num) && value.trim() !== '') return 'number';

        // Date
        const date = new Date(value);
        if (!isNaN(date.getTime())) return 'date';

        return 'string';
    }

    private mergeColumnType(
        current: CSVColumnType,
        next: CSVColumnType
    ): CSVColumnType {
        // Hierarchy: string(4) > number(3) > date(2) > boolean(1)
        const rank: Record<CSVColumnType, number> = {
            boolean: 1,
            date: 2,
            number: 3,
            string: 4
        };
        return rank[next] > rank[current] ? next : current;
    }

    private buildRegex(delimiter: string, hasQuotes: boolean): RegExp {
        return hasQuotes
            ? new RegExp(
                  `(?:^|${delimiter})(?:"([^"]*(?:""[^"]*)*)"|([^${delimiter}]*))`,
                  'g'
              )
            : new RegExp(`([^${delimiter}]+)`, 'g');
    }

    private validateField(
        header: string,
        value: unknown,
        expectedType: CSVColumnType,
        rowNumber: number
    ): ValidationError | null {
        switch (expectedType) {
            case 'number':
                if (typeof value !== 'number' || !isFinite(value as number))
                    return {
                        row: rowNumber,
                        column: header,
                        message: `Expected number, got "${value}"`
                    };
                break;
            case 'boolean':
                if (typeof value !== 'boolean')
                    return {
                        row: rowNumber,
                        column: header,
                        message: `Expected boolean, got "${value}"`
                    };
                break;
            case 'date':
                if (
                    !(value instanceof Date) ||
                    isNaN((value as Date).getTime())
                )
                    return {
                        row: rowNumber,
                        column: header,
                        message: `Invalid date format: "${value}"`
                    };
                break;
            case 'string':
                if (typeof value !== 'string')
                    return {
                        row: rowNumber,
                        column: header,
                        message: `Expected string, got "${value}"`
                    };
                break;
        }
        return null;
    }

    private splitLine(line: string, regex: RegExp): string[] {
        regex.lastIndex = 0;
        const values: string[] = [];
        let m;
        while ((m = regex.exec(line)) !== null) {
            values.push(m[1] ?? m[2] ?? '');
        }
        return values;
    }

    /**
     * Parses the CSV string and converts it into a typed array of objects.
     * rowNumber convention: 1 = header row, 2 = first data row.
     */
    parse<T>(
        config: CSVConfig,
        input: string,
        schema?: Partial<Record<keyof T, CSVColumnType>>
    ): CSVParseResult<T> {
        const { delimiter, hasQuotes } = config;
        const lines = input.trim().split(/\r?\n/);
        const headers = lines[0]
            .split(delimiter)
            .map((h) => h.replace(/"/g, '').trim());

        const dataRows = lines.slice(1);
        const finalResults: WithRowNumber<T>[] = [];
        const validationErrors: ValidationError[] = [];
        const regex = this.buildRegex(delimiter, hasQuotes);

        // --- Infer column types from the first 10 data rows ---
        const inferredTypes: Record<string, CSVColumnType> = {};

        dataRows.slice(0, 10).forEach((line) => {
            const values = this.splitLine(line, regex);
            headers.forEach((header, i) => {
                const raw = values[i]?.trim() ?? '';
                if (!raw) return;
                const detected = this.inferValueType(raw);
                inferredTypes[header] = inferredTypes[header]
                    ? this.mergeColumnType(inferredTypes[header], detected)
                    : detected;
            });
        });

        headers.forEach((h) => {
            if (!inferredTypes[h]) inferredTypes[h] = 'string';
        });

        // --- Parse all rows ---
        dataRows.forEach((line, index) => {
            const values = this.splitLine(line, regex);
            const rowObject: any = {};
            const rowNumber = index + 2; // 1 = header, 2 = first data row

            headers.forEach((header, i) => {
                const rawValue = values[i]?.trim() ?? '';
                const targetType = schema?.[header as keyof T];

                if (!targetType) {
                    rowObject[header] = rawValue;
                    return;
                }

                let castValue: unknown;
                switch (targetType) {
                    case 'number':
                        castValue = Number(rawValue);
                        break;
                    case 'boolean':
                        castValue =
                            rawValue.toLowerCase() === 'true' ||
                            rawValue === '1';
                        break;
                    case 'date':
                        castValue = new Date(rawValue);
                        break;
                    default:
                        castValue = rawValue;
                }

                const error = this.validateField(
                    header,
                    castValue,
                    targetType,
                    rowNumber
                );
                if (error) validationErrors.push(error);
                rowObject[header] = castValue;
            });

            rowObject.__rowNumber = rowNumber;
            finalResults.push(rowObject as WithRowNumber<T>);
        });

        return {
            success: validationErrors.length === 0,
            result: finalResults,
            errors: validationErrors,
            inferredTypes,
            reasonForInvalidity:
                validationErrors.length > 0
                    ? 'Data type mismatch found'
                    : undefined
        };
    }

    /**
     * Searches all rows for entries where row[key] loosely matches value.
     * Returns every match with its rowNumber (2-based) and matched header name.
     */
    find<T>(
        rows: { [key: string]: any }[],
        keyword: string
    ): CSVFindResult<T>[] {
        const results: CSVFindResult<T>[] = [];
        const needle = String(keyword).toLowerCase();

        rows.forEach((row) => {
            const matchedHeaders: string[] = [];

            Object.entries(row).forEach(([header, value]) => {
                if (header === '__rowNumber') return;
                if (String(value).toLowerCase().includes(needle)) {
                    matchedHeaders.push(header);
                }
            });

            if (matchedHeaders.length > 0) {
                results.push({
                    rowNumber: row.__rowNumber,
                    row: row as T,
                    headers: matchedHeaders
                });
            }
        });

        return results;
    }

    /**
     * Updates the row at `rowNumber` (2-based, same as parse/find convention).
     * Each field in `data` is validated against `inferredTypes` before applying.
     * Returns a new rows array — the original is never mutated.
     */
    updateRow<T>(
        rows: T[],
        rowNumber: number,
        data: Partial<T>,
        inferredTypes: Record<string, CSVColumnType>,
        required: boolean = false
    ): CSVUpdateResult<T> {
        const arrayIndex = rowNumber - 2;
        const errors: ValidationError[] = [];

        if (arrayIndex < 0 || arrayIndex >= rows.length) {
            return {
                success: false,
                result: rows,
                errors: [
                    {
                        row: rowNumber,
                        column: '',
                        message: `Row ${rowNumber} does not exist`
                    }
                ]
            };
        }

        // Validate each field against its inferred type
        if (!required) {
            (Object.entries(data as object) as [string, unknown][]).forEach(
                ([header, value]) => {
                    const expectedType = inferredTypes[header];
                    if (!expectedType) return;
                    const error = this.validateField(
                        header,
                        value,
                        expectedType,
                        rowNumber
                    );
                    if (error) errors.push(error);
                }
            );
        }

        if (errors.length > 0) {
            return { success: false, result: rows, errors };
        }

        const newRows = [...rows];
        newRows[arrayIndex] = { ...rows[arrayIndex], ...data };

        return { success: true, result: newRows, errors: [] };
    }

    /**
     * Exports an array back to a CSV string with custom configuration.
     */
    export<T>(data: T[], config: CSVConfig): string {
        if (!data.length) return '';

        const headers = Object.keys(data[0] as object).reduce<string[]>(
            (acc, key) => {
                if (key !== '__rowNumber') acc.push(key);
                return acc;
            },
            []
        );

        const headerRow = headers.join(config.delimiter);

        const rows = data.map((row) => {
            return headers
                .map((header) => {
                    let value = String((row as any)[header] ?? '');
                    value = value.replace(/\n/g, ' ').replace(/"/g, '""');
                    return config.hasQuotes ? `"${value}"` : value;
                })
                .join(config.delimiter);
        });

        return [headerRow, ...rows].join('\n');
    }
}
