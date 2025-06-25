import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    {
        rules: {
            semi: ['error', 'always'],
            indent: ['error', 4],
            'no-multiple-empty-lines': ['error', { max: 1 }],
            'no-unreachable': 'off',
        }
    }
);
