const { rules } = require('@commitlint/config-conventional')

// see https://github.com/vuejs/core/blob/main/scripts/verifyCommit.js
rules['type-enum'][2].push('wip', 'types', 'release', 'workflow', 'dx')

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules,
}
