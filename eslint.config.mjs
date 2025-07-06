// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config({
  files: ['src/*.ts'],
  extends: [
    eslint.configs.recommended,
    tseslint.configs.recommended,
  ],
  rules: {
    '@typescript-eslint/array-type': 'error',
    "indent": ['error', 2], // Use 2 spaces for indentation.
    "quotes": ['error', 'single'], // Enforce single quotes.
    "semi": ['error', 'always'],   // Require semicolons.
    "object-curly-spacing": ['error', 'always']
  },
});
