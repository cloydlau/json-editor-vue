/**
 * 搭建 eslint：
 *   1. pnpm add husky lint-staged eslint @antfu/eslint-config -D
 *   2. npx husky install
 */

module.exports = {
  extends: '@antfu',
  rules: {
    'vue/component-tags-order': ['error', {
      order: [['script', 'template'], 'style'],
    }],
    'vue/no-deprecated-v-bind-sync': 0,
    'vue/attribute-hyphenation': 0,
    'curly': 0,
    'brace-style': 0,
  },
}
