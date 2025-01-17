// Default Config See https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional
import config from '@commitlint/config-conventional'

const { rules } = config

// See https://github.com/vuejs/core/blob/main/scripts/verify-commit.js
rules['type-enum'][2].push('wip', 'types', 'release', 'workflow', 'dx')
rules['header-max-length'][2] = 200
rules['subject-case'][0] = 0

export default {
  extends: ['@commitlint/config-conventional'],
  rules,
}
