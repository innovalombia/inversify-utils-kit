import js from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
import jasmine from 'eslint-plugin-jasmine';
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
            jasmine,
            'sort-destructure-keys': sortKeys
        },
        rules: {
            indent: 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-var-requires': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            'sort-destructure-keys/sort-destructure-keys': 'warn',
            'no-unused-vars': 'off',
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
        files: ['**/migrations/*.js'],
        rules: {
            '@typescript-eslint/no-unused-vars': 'off'
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
