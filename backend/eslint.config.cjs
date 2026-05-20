const js = require('@eslint/js');

module.exports = [
    {
        ignores: ['node_modules/**']
    },
    js.configs.recommended,
    {
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'commonjs',
            globals: {
                AbortController: 'readonly',
                console: 'readonly',
                fetch: 'readonly',
                module: 'readonly',
                process: 'readonly',
                require: 'readonly',
                setTimeout: 'readonly',
                clearTimeout: 'readonly',
                URL: 'readonly'
            }
        },
        rules: {
            'no-console': 'off',
            'no-unused-vars': ['error', { argsIgnorePattern: '^_' }]
        }
    }
];
