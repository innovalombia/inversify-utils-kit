module.exports = {
    root: true,
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module'
    },
    env: {
        jasmine: true,
        node: true,
        commonjs: true,
        es2022: true
    },
    plugins: ['prettier', '@typescript-eslint', 'sort-destructure-keys'],
    parser: '@typescript-eslint/parser',
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
        'prettier'
    ],
    rules: {
        indent: 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'sort-destructure-keys/sort-destructure-keys': 'warn',
        'prettier/prettier': [
            'warn',
            {
                usePrettierrc: true
            }
        ]
    },
    overrides: [
        {
            files: ['*.js'],
            rules: {
                '@typescript-eslint/no-unused-vars': 'off'
            }
        }
    ]
};
