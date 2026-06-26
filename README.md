# inversify-utils-kit

[![npm version](https://img.shields.io/npm/v/inversify-utils-kit.svg)](https://www.npmjs.com/package/inversify-utils-kit)
[![license](https://img.shields.io/npm/l/inversify-utils-kit.svg)](https://github.com/innovalombia/inversify-utils-kit/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.18.0-brightgreen.svg)](https://nodejs.org/)

A collection of **injectable utility adapters** for [Inversify](https://inversify.io/) — swap implementations without changing your business logic.

---

## Why?

Working with dates, strings, JSON, CSV, or currency formatting in a large TypeScript project? You probably don't want your business logic tightly coupled to `luxon`, `numeral`, or any other specific library. **inversify-utils-kit** gives you clean adapter interfaces you can bind in your IoC container and swap at will — perfect for testing, multi-environment support, or migrating between libraries.

## Features

| Adapter | Interface | Default Implementation | Peer Dependency |
|---|---|---|---|
| **Dates** | `DatesAdapter` | `LuxonDatesAdapter` | `luxon` |
| **JSON** | `JsonAdapter` | `DefaultJsonAdapter` | — |
| **Strings** | `StringUtilsAdapter` | `DefaultStringUtilsAdapter` | — |
| **CSV** | `CSVAdapter` | `DefaultCSVAdapter` | — |
| **Money** | `MoneyFormatterAdapter` | `NumeralMoneyFormatterAdapter` | `numeral` |

## Installation

```bash
npm install inversify-utils-kit inversify reflect-metadata
```

Install peer dependencies based on the adapters you need:

```bash
# Dates adapter
npm install luxon

# Money formatter
npm install numeral

# CSV export to YAML (optional)
npm install yaml

# Decimal precision (optional)
npm install decimal.js
```

## Quick Start

### 1. Configure the container

```ts
import 'reflect-metadata';
import { Container } from 'inversify';
import {
  JSON_ADAPTER_TYPE,
  JsonAdapter,
  DefaultJsonAdapter,
  DATES_ADAPTER_TYPE,
  DatesAdapter,
  LuxonDatesAdapter,
  TIMEZONE_DATES_ADAPTER_CONST_TYPE,
  LANG_DATES_ADAPTER_CONST_TYPE
} from 'inversify-utils-kit';

const container = new Container();

// JSON adapter (no peer deps needed)
container.bind<JsonAdapter>(JSON_ADAPTER_TYPE).to(DefaultJsonAdapter);

// Dates adapter (requires luxon)
container.bind<DatesAdapter>(DATES_ADAPTER_TYPE).to(LuxonDatesAdapter);
container.bind<string>(TIMEZONE_DATES_ADAPTER_CONST_TYPE).toConstantValue('America/New_York');
container.bind<string>(LANG_DATES_ADAPTER_CONST_TYPE).toConstantValue('en');

export { container };
```

### 2. Use in your services

```ts
import { injectable, inject } from 'inversify';
import { JSON_ADAPTER_TYPE, JsonAdapter } from 'inversify-utils-kit';

@injectable()
export class OrderService {
  constructor(
    @inject(JSON_ADAPTER_TYPE) private json: JsonAdapter
  ) {}

  parseOrder(raw: string) {
    const { result, reasonForInvalidity } = this.json.deserializeJson(raw);
    if (reasonForInvalidity) throw new Error(reasonForInvalidity);
    return result;
  }
}
```

## API Reference

### DatesAdapter

Bind with `DATES_ADAPTER_TYPE`. Default: `LuxonDatesAdapter`.

| Method | Description |
|---|---|
| `now()` | Current timestamp in milliseconds |
| `fromString(date)` | Parse a date string to epoch ms |
| `fromFormat(input, format, isLocal?)` | Parse with a specific format |
| `fromUnix(input)` | Parse Unix timestamps (seconds, ms, μs, ns) |
| `toFormat(epoch, format?)` | Format epoch ms to string |
| `toISO(epoch)` | Convert to ISO 8601 string |
| `toUTC(epoch)` | Convert to UTC ISO string |
| `toUnix(epoch)` | Convert to Unix seconds |
| `toLocal(epoch)` | Convert to local ISO string |
| `plus(epoch, duration)` | Add days/hours/minutes/seconds |
| `minus(epoch, duration)` | Subtract days/hours/minutes/seconds |
| `fromDateUTCtoLocalDate(utcDate, format?)` | UTC string to formatted local date |
| `fromDateISOtoLocalDate(isoDate, format?)` | ISO string to formatted local date |
| `currentDatePlusToLocalDate(duration, format?)` | Now + duration, formatted |

**Constants for timezone and locale:**

```ts
container.bind<string>(TIMEZONE_DATES_ADAPTER_CONST_TYPE).toConstantValue('Europe/Madrid');
container.bind<string>(LANG_DATES_ADAPTER_CONST_TYPE).toConstantValue('es');
```

### JsonAdapter

Bind with `JSON_ADAPTER_TYPE`. Default: `DefaultJsonAdapter`.

| Method | Description |
|---|---|
| `parseStringToJson(input)` | Parse JSON string to object (tolerant of trailing commas) |
| `parseJsonToString(input, pretty?)` | Stringify an object |
| `parseJsonStringToString(input, pretty?)` | Re-format a JSON string |
| `deserializeJson(input)` | Deserialize escaped/quoted JSON |
| `serializeJson(input, escapeQuotes?)` | Serialize with optional quote escaping |

All methods return `{ result, reasonForInvalidity }` — no exceptions thrown.

### StringUtilsAdapter

Bind with `STRING_UTILS_ADAPTER_TYPE`. Default: `DefaultStringUtilsAdapter`.

| Method | Description |
|---|---|
| `checkStringCase(word)` | Detect the case convention of a string |
| `textCaseToCamelCase(word)` | Convert any case to `camelCase` |
| `textCaseToPascalCase(word)` | Convert any case to `PascalCase` |
| `textCaseToSnakeCase(word, upper?)` | Convert to `snake_case` or `UPPER_SNAKE_CASE` |
| `textCaseToKebabCase(word)` | Convert to `kebab-case` |
| `textCaseToAllCases(word)` | Get all case conversions at once |
| `toCapitalize(payload)` | Capitalize each word |
| `toSimpleCapitalize(word)` | Capitalize first letter only |

**Supported case detection:**

`camelCase` · `PascalCase` · `snake_case` · `UPPER_SNAKE_CASE` · `kebab-case` · `UPPER CASE` · `lower case` · `Capitalize Case` · `money (1,000.00)` · `number (1000)`

### CSVAdapter

Bind with `CSV_ADAPTER_TYPE`. Default: `DefaultCSVAdapter`.

| Method | Description |
|---|---|
| `identifyConfig(input)` | Auto-detect delimiter, quotes, and header presence |
| `parse(config, input, schema?)` | Parse CSV to typed objects with validation |
| `find(rows, keyword)` | Search all rows for a keyword match |
| `updateRow(rows, rowNumber, data, types, required?)` | Immutably update a row with type validation |
| `export(data, config)` | Convert objects back to CSV string |

```ts
import { CSV_ADAPTER_TYPE, CSVAdapter } from 'inversify-utils-kit';

const csv = container.get<CSVAdapter>(CSV_ADAPTER_TYPE);

const config = csv.identifyConfig(rawCsv);
if (config.success && config.result) {
  const { result, errors, inferredTypes } = csv.parse(config.result, rawCsv);
  console.log(result);    // Typed objects with __rowNumber
  console.log(errors);    // Validation errors (if any)
}
```

### MoneyFormatterAdapter

Bind with `MONEY_FORMATTER_ADAPTER_TYPE`. Default: `NumeralMoneyFormatterAdapter`.

| Method | Description |
|---|---|
| `toMoneyFormat(money)` | Format number as currency string (`$ 1,000.00`) |

## Usage Examples

### AWS Lambda

```ts
import { JSON_ADAPTER_TYPE, JsonAdapter } from 'inversify-utils-kit';
import { container } from './config';

let jsonAdapter: JsonAdapter;

export const handler = async (event: any) => {
  jsonAdapter = jsonAdapter ?? container.get<JsonAdapter>(JSON_ADAPTER_TYPE);
  return jsonAdapter.deserializeJson(event.body).result;
};
```

### Vue 3

```ts
// main.ts
import { DATES_ADAPTER_TYPE, DatesAdapter } from 'inversify-utils-kit';
import { createApp } from 'vue';
import { container } from './config';

const app = createApp(App);
const datesAdapter = container.get<DatesAdapter>(DATES_ADAPTER_TYPE);
app.provide('datesAdapter', datesAdapter);
app.mount('#app');
```

```vue
<script lang="ts" setup>
import type { DatesAdapter } from 'inversify-utils-kit';
import { inject, ref } from 'vue';

const datesAdapter = inject('datesAdapter') as DatesAdapter;
const posixDate = ref(datesAdapter.toUnix(datesAdapter.now()));
</script>
```

### NestJS / Express

```ts
import { injectable, inject } from 'inversify';
import { STRING_UTILS_ADAPTER_TYPE, StringUtilsAdapter } from 'inversify-utils-kit';

@injectable()
export class NamingService {
  constructor(
    @inject(STRING_UTILS_ADAPTER_TYPE) private strings: StringUtilsAdapter
  ) {}

  toApiFormat(name: string): string {
    return this.strings.textCaseToSnakeCase(name);
  }

  toDtoFormat(name: string): string {
    return this.strings.textCaseToCamelCase(name);
  }
}
```

## Binding Symbols

| Symbol | Adapter |
|---|---|
| `JSON_ADAPTER_TYPE` | `JsonAdapter` |
| `DATES_ADAPTER_TYPE` | `DatesAdapter` |
| `TIMEZONE_DATES_ADAPTER_CONST_TYPE` | Timezone string constant |
| `LANG_DATES_ADAPTER_CONST_TYPE` | Locale string constant |
| `STRING_UTILS_ADAPTER_TYPE` | `StringUtilsAdapter` |
| `CSV_ADAPTER_TYPE` | `CSVAdapter` |
| `MONEY_FORMATTER_ADAPTER_TYPE` | `MoneyFormatterAdapter` |

## Requirements

- **Node.js** >= 18.18.0
- **TypeScript** >= 5.x
- **inversify** >= 6.x
- **reflect-metadata**

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup, coding standards, and release process.

## License

[ISC](LICENSE)
