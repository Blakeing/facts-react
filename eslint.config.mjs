// Node.js built-ins
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// External packages
import js from '@eslint/js'
import eslintConfigPrettier from 'eslint-config-prettier'
import eslintPluginImport from 'eslint-plugin-import'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import eslintPluginReact from 'eslint-plugin-react'
import eslintPluginReactHooks from 'eslint-plugin-react-hooks'
import eslintPluginReactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import * as tseslint from 'typescript-eslint'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Base configuration for all files
const baseConfig = {
  plugins: {
    import: eslintPluginImport,
    prettier: eslintPluginPrettier,
  },
  rules: {
    'import/order': [
      'error',
      {
        'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'type'],
        'newlines-between': 'always',
        'alphabetize': { order: 'asc', caseInsensitive: true },
      },
    ],
    'import/no-duplicates': 'error',
    'prettier/prettier': 'error',
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-debugger': 'error',
    'no-alert': 'error',
    'prefer-const': 'error',
    'no-var': 'error',
    'eqeqeq': ['error', 'always'],
  },
}

// Configuration specific to JavaScript files
const jsConfig = {
  files: ['**/*.{js,mjs,cjs}'],
  ...baseConfig,
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    globals: {
      ...globals.browser,
      ...globals.node,
    },
  },
}

// Configuration specific to TypeScript and React files
const tsConfig = {
  files: ['**/*.{ts,tsx}'],
  ...baseConfig,
  plugins: {
    ...baseConfig.plugins,
    '@typescript-eslint': tseslint.plugin,
    'react': eslintPluginReact,
    'react-hooks': eslintPluginReactHooks,
    'react-refresh': eslintPluginReactRefresh,
  },
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parser: tseslint.parser,
    parserOptions: {
      project: './tsconfig.eslint.json',
      tsconfigRootDir: __dirname,
    },
    globals: {
      ...globals.browser,
      React: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    ...baseConfig.rules,
    ...js.configs.recommended.rules,
    ...eslintPluginReact.configs.recommended.rules,
    ...eslintPluginReactHooks.configs.recommended.rules,
    ...tseslint.configs.recommendedTypeChecked.rules,
    ...tseslint.configs.stylisticTypeChecked.rules,

    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
    'react/self-closing-comp': 'error',

    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
  },
}

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '**/*.config.{js,ts}',
      '**/*.d.ts',
      'vite.config.ts',
      'postcss.config.mjs',
      'tailwind.config.ts',
    ],
  },
  eslintConfigPrettier,
  jsConfig,
  tsConfig,
]
