/**
 * 搭建 eslint + prettier：
 *   1. pnpm add husky lint-staged eslint @antfu/eslint-config -D
 *   3. npx husky install
 *   2. npx husky add .husky/pre-commit "npx lint-staged"
 */

module.exports = {
  extends: '@antfu',
  rules: {
    'vue/component-tags-order': ['error', {
      order: [['script', 'template'], 'style'],
    }],
  },
}
