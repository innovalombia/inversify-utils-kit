import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
import sortKeys from 'eslint-plugin-sort-destructure-keys';

export default [
    js.configs.recommended,
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.js'],
        languageOptions: {
            parser: tsParser,
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                require: 'readonly',
                module: 'readonly',
                process: 'readonly',
                console: 'readonly'
            }
        },
        plugins: {
            '@typescript-eslint': ts,
            prettier,
            'sort-destructure-keys': sortKeys
        },
        rules: {
            indent: 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-var-requires': 'off',
            'sort-destructure-keys/sort-destructure-keys': 'warn',
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    vars: 'local',
                    args: 'none'
                }
            ],
            'prettier/prettier': [
                'warn',
                {
                    usePrettierrc: true
                }
            ],
            'no-undef': 'off'
        }
    },

    {
        ignores: [
            'package.json',
            'package-lock.json',
            'node_modules/',
            'dist/',
            'coverage/',
            '.vscode/',
            '.nuxt/',
            '.nyc_output/',
            '.scannerwork/'
        ]
    }
];
