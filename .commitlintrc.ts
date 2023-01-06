// Default Config See https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional
const { rules } = require('@commitlint/config-conventional')

// See https://github.com/vuejs/core/blob/main/scripts/verifyCommit.js
rules['type-enum'][2].push('wip', 'types', 'release', 'workflow', 'dx')
rules['header-max-length'][2] = 150

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules,
}
