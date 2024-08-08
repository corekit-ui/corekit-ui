// @ts-check
import eslint from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import angular from 'angular-eslint'
import typescript from 'typescript-eslint'

export default typescript.config(
  {
    files: ['**/*.ts'],
    plugins: { '@stylistic': stylistic },
    languageOptions: {
      parserOptions: { project: true, tsconfigRootDir: import.meta.dirname }
    },
    extends: [
      eslint.configs.all,
      ...typescript.configs.all,
      ...angular.configs.tsAll
    ],
    processor: angular.processInlineTemplates,
    rules: {
      'prefer-const': 'error',
      'no-unused-vars': 'error',
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      curly: ['error', 'multi'],
      'no-console': 'warn',
      'one-var': 'off',
      'func-style': ['error', 'declaration'],
      'space-before-function-paren': ['error', 'never'],
      'new-cap': 'off',
      'sort-keys': 'off',

      '@stylistic/semi': ['error', 'never'],
      '@stylistic/function-call-spacing': 'error',
      '@stylistic/lines-between-class-members': [
        'error',
        'always',
        { exceptAfterSingleLine: true }
      ],
      '@stylistic/padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          prev: '*',
          next: ['function', 'block', 'block-like', 'return', 'break']
        },
        { blankLine: 'always', prev: '*', next: ['const', 'let'] },
        { blankLine: 'always', prev: ['const', 'let'], next: '*' },
        {
          blankLine: 'any',
          prev: ['const', 'let'],
          next: ['const', 'let']
        },
        { blankLine: 'always', prev: 'directive', next: '*' },
        { blankLine: 'any', prev: 'directive', next: 'directive' },
        { blankLine: 'always', prev: ['case', 'default'], next: '*' },
        { blankLine: 'always', prev: 'import', next: '*' },
        { blankLine: 'any', prev: 'import', next: 'import' },
        {
          blankLine: 'never',
          prev: 'function-overload',
          next: ['function-overload', 'function']
        }
      ],

      '@typescript-eslint/no-confusing-void-expression': 'off',
      '@typescript-eslint/method-signature-style': ['error', 'method'],
      '@typescript-eslint/no-magic-numbers': 'warn',
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
      '@typescript-eslint/class-methods-use-this': 'off',
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        {
          accessibility: 'explicit',
          overrides: {
            constructors: 'no-public'
          }
        }
      ],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'memberLike',
          modifiers: ['private'],
          format: ['camelCase'],
          leadingUnderscore: 'require'
        },
        {
          selector: ['classProperty'],
          modifiers: ['private', 'static', 'readonly'],
          format: ['UPPER_CASE'],
          leadingUnderscore: 'forbid'
        }
      ],
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-ignore': 'allow-with-description',
          'ts-nocheck': 'allow-with-description',
          'ts-expect-error': 'allow-with-description',
          'ts-check': false,
          minimumDescriptionLength: 30
        }
      ],
      '@typescript-eslint/member-ordering': [
        'error',
        {
          default: [
            // Index signature
            'signature',
            'call-signature',

            // Fields
            'public-field',
            'private-field',

            // Static initialization
            'static-initialization',

            // Constructors
            'constructor',

            // Methods
            'public-method',
            'protected-method',
            'private-method',
            '#private-method'
          ]
        }
      ],

      '@angular-eslint/no-pipe-impure': 'warn',
      '@angular-eslint/prefer-on-push-component-change-detection': 'warn',
      '@angular-eslint/component-class-suffix': 'off',
      '@angular-eslint/directive-class-suffix': 'off',
      '@angular-eslint/directive-selector': [
        'error',
        { type: ['element', 'attribute'], prefix: 'ck', style: 'camelCase' }
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: ['element', 'attribute'], prefix: 'ck', style: 'kebab-case' }
      ],
      '@angular-eslint/component-max-inline-declarations': [
        'error',
        { template: 1 }
      ],
      '@angular-eslint/no-input-prefix': [
        'error',
        { prefixes: ['on', 'is', 'has', 'had', 'was', 'been'] }
      ]
    }
  },
  {
    files: ['**/*.html'],
    extends: angular.configs.templateAll,
    rules: {}
  }
)
