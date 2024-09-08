// @ts-check
const eslint = require('@eslint/js')
const stylistic = require('@stylistic/eslint-plugin')
const angular = require('angular-eslint')
const typescript = require('typescript-eslint')

module.exports = typescript.config(
  {
    files: ['**/*.ts'],
    plugins: { '@stylistic': stylistic },
    languageOptions: {
      parserOptions: { project: true, tsconfigRootDir: __dirname }
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
      curly: ['error', 'multi-line'],
      'no-console': 'warn',
      'one-var': 'off',
      'func-style': ['error', 'declaration'],
      'space-before-function-paren': ['error', 'never'],
      'new-cap': 'off',
      'sort-keys': 'off',
      'sort-imports': 'off',
      'no-duplicate-imports': 'off',
      'no-underscore-dangle': 'off',
      'capitalized-comments': 'off',
      'arrow-body-style': 'off',
      'no-alert': 'warn',
      'no-ternary': 'off',
      'no-implicit-coercion': 'off',
      'no-plusplus': 'off',
      'max-classes-per-file': 'off',
      'no-nested-ternary': 'off',
      'no-warning-comments': 'off',
      'no-eq-null': 'off',
      'max-lines': 'off',
      'no-undefined': 'off',

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

      '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
      '@typescript-eslint/no-unnecessary-condition': 'warn',
      '@typescript-eslint/no-magic-numbers': 'off',
      '@typescript-eslint/unified-signatures': 'off',
      '@typescript-eslint/consistent-return': 'off',
      '@typescript-eslint/no-confusing-void-expression': 'off',
      '@typescript-eslint/method-signature-style': ['error', 'method'],
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
      '@typescript-eslint/class-methods-use-this': 'off',
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
      '@typescript-eslint/no-extraneous-class': 'off',
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/parameter-properties': 'off',
      '@typescript-eslint/consistent-type-imports': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/max-params': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/no-invalid-void-type': 'off',
      '@typescript-eslint/explicit-member-accessibility': [
        'error',
        { accessibility: 'explicit', overrides: { constructors: 'no-public' } }
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
      '@typescript-eslint/no-unused-expressions': [
        'error',
        { allowShortCircuit: true }
      ],

      '@angular-eslint/template/no-any': 'off',
      '@angular-eslint/no-forward-ref': 'off',
      '@angular-eslint/no-pipe-impure': 'warn',
      '@angular-eslint/prefer-on-push-component-change-detection': 'warn',
      '@angular-eslint/component-class-suffix': 'off',
      '@angular-eslint/directive-class-suffix': 'off',
      '@angular-eslint/no-host-metadata-property': 'off',
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
    rules: {
      '@angular-eslint/template/i18n': 'off',
      '@angular-eslint/template/no-call-expression': 'off'
    }
  }
)
