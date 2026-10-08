import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
 { ignores: ['dist/**', 'work/**', 'docs/visual-review/review-runtime/**'] },
 js.configs.recommended,
 { files: ['**/*.{js,jsx,mjs}'], languageOptions: { ecmaVersion: 'latest', sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } }, globals: { ...globals.browser, ...globals.node } }, rules: { 'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^_' }] } },
 { files: ['src/**/*.{js,jsx}'], plugins: { 'react-hooks': reactHooks, 'react-refresh': reactRefresh }, rules: { 'react-hooks/rules-of-hooks': 'error', 'react-hooks/exhaustive-deps': 'error', 'react-refresh/only-export-components': ['error', { allowConstantExport: true }] } },
];
