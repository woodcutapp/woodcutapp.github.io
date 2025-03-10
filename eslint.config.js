import eslint from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import typescriptParser from '@typescript-eslint/parser'
import importPlugin from 'eslint-plugin-import'
import reactRecomended from 'eslint-plugin-react/configs/recommended.js'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default [
  reactRecomended,
  ...tseslint.config(
    eslint.configs.recommended,
    stylistic.configs['recommended-flat'],
    ...tseslint.configs.recommendedTypeChecked,
    {
      settings: {
        react: {
          version: 'detect',
        },
      },
      languageOptions: {
        parser: typescriptParser,
        parserOptions: {
          project: './tsconfig.app.json',
          sourceType: 'module',
          ecmaVersion: 2020,
        },
      },
      plugins: {
        import: importPlugin,
      },
      files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
      extends: [tseslint.configs.disableTypeChecked],
      rules: {
        '@stylistic/jsx-curly-brace-presence': 0,
        'import/no-duplicates': 'error',
        'import/order': ['error', {
          'newlines-between': 'always',
          'groups': [
            'external',
            'builtin',
            'internal',
            'sibling',
            'parent',
            'index',
          ],
          'pathGroups': [
            {
              pattern: 'components',
              group: 'internal',
            },
            {
              pattern: 'common',
              group: 'internal',
            },
            {
              pattern: 'routes/ **',
              group: 'internal',
            },
            {
              pattern: 'assets/**',
              group: 'internal',
              position: 'after',
            },
          ],
          'pathGroupsExcludedImportTypes': ['internal'],
          'alphabetize': {
            order: 'asc',
            caseInsensitive: true,
          },
        }],
        'no-duplicate-imports': 'error',
        'no-console': 'error',
      },
    },
  ),
  {
    ...reactRecomended,
    plugins: {
      ...reactRecomended.plugins,
      'react-hooks': reactHooksPlugin,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactRecomended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
    },
  },
]
