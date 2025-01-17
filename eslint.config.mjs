import path from 'node:path'
import { fileURLToPath } from 'node:url'
import antfu from '@antfu/eslint-config'
import { FlatCompat } from '@eslint/eslintrc'
import nounsanitized from 'eslint-plugin-no-unsanitized'

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

export default antfu(
  {
    formatters: true,
    ignores: ['demo/', 'stats.html'],
    lessOpinionated: true,
  },
  {
    rules: {
      'brace-style': ['error', 'stroustrup', { allowSingleLine: false }],
      'curly': ['error', 'all'],
      'no-console': ['warn', { allow: ['info', 'warn', 'error'] }],
      'vue/max-attributes-per-line': ['error', { singleline: 3 }],
      'vue/max-len': ['error', {
        code: 160,
        ignoreComments: true,
        ignoreHTMLAttributeValues: true,
        ignoreHTMLTextContents: true,
        ignoreRegExpLiterals: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreUrls: true,
      }],
      'vue/no-deprecated-v-bind-sync': 'off',
      'vue/no-deprecated-v-on-native-modifier': 'off',
      'vue/no-deprecated-destroyed-lifecycle': 'off',
      'vue/no-deprecated-dollar-listeners-api': 'off',
      'vue/no-deprecated-dollar-scopedslots-api': 'off',
      'vue/singleline-html-element-content-newline': 'off',
    },
    languageOptions: {
      globals: {

      },
    },
  },
  [nounsanitized.configs.recommended], // 代码安全性检测
  // mimic ESLintRC-style extends
  ...compat.extends('plugin:financial/recommended'), // 避免财务计算
)
