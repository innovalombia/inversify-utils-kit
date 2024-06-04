# Inversify-utils-kit

Common library with all adapters

## Index

1. [Setup](#setup)
2. [Use](#use)
3. [Manage repository](#manage-repository)
4. [Versioning](#versioning)

## Setup 🔨 <a name="setup"></a>

-   Install package

```sh
npm i inversify & npm i inversify-utils-kit
```

## Use 🧑‍🔧 <a name="use"></a>

### Lambda functions

- Create config file (config/index.ts)

```ts
import 'reflect-metadata';

import { Container } from 'inversify';
import {
    DefaultJsonAdapter,
    JSON_ADAPTER_TYPE,
    type JsonAdapter
} from 'inversify-utils-kit';

const AppContainer: Container = new Container();

AppContainer.bind<JsonAdapter>(JSON_ADAPTER_TYPE).to(DefaultJsonAdapter);

export { AppContainer };
```

- Entry point with handler function (main.ts)

```ts
import {
    JSON_ADAPTER_TYPE,
    type JsonAdapter
} from 'inversify-utils-kit';

import { AppContainer } from './config';

let jsonAdapter: JsonAdapter;

export const handler = async (event: any, context: any): Promise<any> => {
    try {
        jsonAdapter =
            jsonAdapter ?? AppContainer.get<JsonAdapter>(JSON_ADAPTER_TYPE);
        return jsonAdapter.deserializeJson(event.body).result;
    } catch (error) {
        logger.error('Error index %o', error);
        throw error;
    }
};

```

- Classes that need the adapter

```ts
import 'reflect-metadata';

import {
    JSON_ADAPTER_TYPE,
    type JsonAdapter
} from 'inversify-utils-kit';

@injectable()
export class MainServiceImpl {
    constructor(
        @inject(JSON_ADAPTER_TYPE) private jsonAdapter: JsonAdapter,
    ) {}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    processData(event: { body: string }): any {
        return jsonAdapter.deserializeJson(event.body).result;
    }
}

```


### Vue 3 projects

- Create config file (config/index.ts)

```ts
import 'reflect-metadata';

import { Container } from 'inversify';
import {
    DATES_ADAPTER_TYPE,
    type DatesAdapter,
    LANG_DATES_ADAPTER_CONST_TYPE,
    LuxonDatesAdapter,
    TIMEZONE_DATES_ADAPTER_CONST_TYPE
} from 'inversify-utils-kit';

const AppContainer: Container = new Container();

AppContainer.bind<DatesAdapter>(DATES_ADAPTER_TYPE).to(LuxonDatesAdapter);
AppContainer.bind<string>(TIMEZONE_DATES_ADAPTER_CONST_TYPE).toConstantValue(
    Intl.DateTimeFormat().resolvedOptions().timeZone
);
AppContainer.bind<string>(LANG_DATES_ADAPTER_CONST_TYPE).toConstantValue(
    navigator.language
);

export { AppContainer };
```

- Entry point for vue application (main.ts)

```ts
import { DATES_ADAPTER_TYPE, type DatesAdapter } from 'inversify-utils-kit';
import { createApp } from 'vue';

import App from './App.vue';
import { AppContainer } from './config';
import router from './router';

const app = createApp(App);
app.use(router);

const datesAdapter = AppContainer.get<DatesAdapter>(DATES_ADAPTER_TYPE);
app.provide('datesAdapter', datesAdapter);

app.mount('#app');
```

- Vue component

```vue
<script lang="ts" setup>
import type { DatesAdapter } from 'inversify-utils-kit';
import { inject, onMounted, ref } from 'vue';

const datesAdapter = inject('datesAdapter') as DatesAdapter;

const posix = datesAdapter.toUnix(datesAdapter.now());
const posixDate = ref(posix);

const updateDate = () => {
    const posix = datesAdapter.toUnix(datesAdapter.now());
    posixDate.value = posix;
};
</script>
```

## Manage repository 🤳 <a name="manage-repository"></a>

-   Install dependencies

```sh
npm i
```

-   Check code by linter

```sh
npm run lint
```

-   Check and fix code by linter

```sh
npm run lint:fix
```

-   Check style code

```sh
npm run prettier
```

-   Check and fix style code

```sh
npm run prettier:write
```

-   Get coverage test terminal

```sh
npm run coverage
```

-   Build package

```sh
npm run build
```

-   Get increment version

```sh
npm run up
```

-   Setup token

```sh
export NPM_AUTH_TOKEN=*********
```

-   Upload new version

```sh
npm run upload
```

## Versioning 🔢 <a name="versioning"></a>

### Major (Breaking)

| Emoji | Code &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; | Description &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 💥    | `:boom:`                                                                                                                                                                                          | Introduce breaking changes                                                                                                                                                                                                                                                                                                                                                      |

### Minor (Feature)

| Emoji | Code &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; | Description &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ✨    | `:sparkles:`                                                                                                                                                                                      | Introduce new features.                                                                                                                                                                                                                                                                                                                                                         |

### Patch (Fix)

| Emoji | Code &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; | Description &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ⚡️   | `:zap:`                                                                                                                                                                                           | Improve performance.                                                                                                                                                                                                                                                                                                                                                            |
| 🐛    | `:bug:`                                                                                                                                                                                           | Fix a bug.                                                                                                                                                                                                                                                                                                                                                                      |
| 🚑️   | `:ambulance:`                                                                                                                                                                                     | Critical hotfix.                                                                                                                                                                                                                                                                                                                                                                |
| 💄    | `:lipstick:`                                                                                                                                                                                      | Add or update the UI and style files.                                                                                                                                                                                                                                                                                                                                           |
| 🔒️   | `:lock:`                                                                                                                                                                                          | Fix security issues.                                                                                                                                                                                                                                                                                                                                                            |
| ⬇️    | `:arrow_down:`                                                                                                                                                                                    | Downgrade dependencies.                                                                                                                                                                                                                                                                                                                                                         |
| ⬆️    | `:arrow_up:`                                                                                                                                                                                      | Upgrade dependencies.                                                                                                                                                                                                                                                                                                                                                           |
| 📌    | `:pushpin:`                                                                                                                                                                                       | Pin dependencies to specific versions.                                                                                                                                                                                                                                                                                                                                          |
| 📈    | `:chart_with_upwards_trend:`                                                                                                                                                                      | Add or update analytics or track code.                                                                                                                                                                                                                                                                                                                                          |
| ➕    | `:heavy_plus_sign:`                                                                                                                                                                               | Add a dependency.                                                                                                                                                                                                                                                                                                                                                               |
| ➖    | `:heavy_minus_sign:`                                                                                                                                                                              | Remove a dependency.                                                                                                                                                                                                                                                                                                                                                            |
| 🔧    | `:wrench:`                                                                                                                                                                                        | Add or update configuration files.                                                                                                                                                                                                                                                                                                                                              |
| 🌐    | `:globe_with_meridians:`                                                                                                                                                                          | Internationalization and localization.                                                                                                                                                                                                                                                                                                                                          |
| ✏️    | `:pencil2:`                                                                                                                                                                                       | Fix typos.                                                                                                                                                                                                                                                                                                                                                                      |
| ⏪️   | `:rewind:`                                                                                                                                                                                        | Revert changes.                                                                                                                                                                                                                                                                                                                                                                 |
| 📦️   | `:package:`                                                                                                                                                                                       | Add or update compiled files or packages.                                                                                                                                                                                                                                                                                                                                       |
| 👽️   | `:alien:`                                                                                                                                                                                         | Update code due to external API changes.                                                                                                                                                                                                                                                                                                                                        |
| 🍱    | `:bento:`                                                                                                                                                                                         | Add or update assets.                                                                                                                                                                                                                                                                                                                                                           |
| ♿️    | `:wheelchair:`                                                                                                                                                                                    | Improve accessibility.                                                                                                                                                                                                                                                                                                                                                          |
| 💬    | `:speech_balloon:`                                                                                                                                                                                | Add or update text and literals.                                                                                                                                                                                                                                                                                                                                                |
| 🗃️    | `:card_file_box:`                                                                                                                                                                                 | Perform database related changes.                                                                                                                                                                                                                                                                                                                                               |
| 🚸    | `:children_crossing:`                                                                                                                                                                             | Improve user experience / usability.                                                                                                                                                                                                                                                                                                                                            |
| 📱    | `:iphone:`                                                                                                                                                                                        | Work on responsive design.                                                                                                                                                                                                                                                                                                                                                      |
| 🥚    | `:egg:`                                                                                                                                                                                           | Add or update an easter egg.                                                                                                                                                                                                                                                                                                                                                    |
| ⚗️    | `:alembic:`                                                                                                                                                                                       | Perform experiments.                                                                                                                                                                                                                                                                                                                                                            |
| 🔍️   | `:mag:`                                                                                                                                                                                           | Improve SEO.                                                                                                                                                                                                                                                                                                                                                                    |
| 🏷️    | `:label:`                                                                                                                                                                                         | Add or update types.                                                                                                                                                                                                                                                                                                                                                            |
| 🚩    | `:triangular_flag_on_post:`                                                                                                                                                                       | Add, update, or remove feature flags.                                                                                                                                                                                                                                                                                                                                           |
| 🥅    | `:goal_net:`                                                                                                                                                                                      | Catch errors.                                                                                                                                                                                                                                                                                                                                                                   |
| 💫    | `:dizzy:`                                                                                                                                                                                         | Add or update animations and transitions.                                                                                                                                                                                                                                                                                                                                       |
| 🗑️    | `:wastebasket:`                                                                                                                                                                                   | Deprecate code that needs to be cleaned up.                                                                                                                                                                                                                                                                                                                                     |
| 🛂    | `:passport_control:`                                                                                                                                                                              | Work on code related to authorization, roles and permissions.                                                                                                                                                                                                                                                                                                                   |
| 🩹    | `:adhesive_bandage:`                                                                                                                                                                              | Simple fix for a non-critical issue.                                                                                                                                                                                                                                                                                                                                            |
| 👔    | `:necktie:`                                                                                                                                                                                       | Add or update business logic                                                                                                                                                                                                                                                                                                                                                    |
