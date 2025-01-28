import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  { ignores: ['dist', 'node_modules'] }, // Ignore built files
  {
    extends: [
      js.configs.recommended, // Base JavaScript rules
      ...tseslint.configs.recommended, // TypeScript best practices
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      react.configs.recommended, // React best practices
      reactHooks.configs.recommended, // React Hooks best practices
      prettierConfig // 👈 Disables ESLint rules that conflict with Prettier
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022, // Match with tsconfig.json
      globals: {
        ...globals.browser,
        React: 'readonly',
      },
      sourceType: 'module',
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      react, // React plugin
      'react-hooks': reactHooks, // Enforces Hooks rules
      'react-refresh': reactRefresh, // Fast refresh checks
      import: importPlugin, // Enforces import order & best practices
      prettier: prettierPlugin, // 👈 Enables Prettier integration
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      /* ✅ Import rules for better module resolution */
      'import/order': ['error', {
        'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'type'],
        'newlines-between': 'always',
        'alphabetize': { 'order': 'asc', 'caseInsensitive': true }
      }],
      'import/no-unresolved': 'error', // Prevent missing modules
      'import/no-extraneous-dependencies': 'error', // Prevent wrong dependencies
      'import/no-cycle': 'error',
      'import/no-duplicates': 'error',

      /* ✅ React-specific rules */
      'react/jsx-uses-react': 'off', // Not needed in React 17+
      'react/react-in-jsx-scope': 'off', // Not needed in React 17+
      'react/prop-types': 'off',
      'react/jsx-curly-brace-presence': ['error', { 'props': 'never', 'children': 'never' }],
      'react/self-closing-comp': 'error',

      /* ✅ TypeScript rules */
      ...tseslint.rules["no-explicit-any"],
      ...tseslint.rules["explicit-function-return-type"],
      ...tseslint.rules["consistent-type-imports"],
      ...tseslint.rules["no-unused-vars"],

      /* ✅ Prettier Integration */
      'prettier/prettier': 'error', // 👈 Ensures Prettier formatting rules are enforced

      /* ✅ Best practices */
      'no-console': ['warn', { 'allow': ['warn', 'error'] }], // Avoid unnecessary console.logs
      'no-debugger': 'error', // Prevent accidental debugger usage
      'no-alert': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'eqeqeq': ['error', 'always'],
    },
  }
);
