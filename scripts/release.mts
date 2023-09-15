import fs from 'node:fs'
import prompts from 'prompts'
import * as semver from 'semver'
import spawn from 'cross-spawn'
import { cyan } from 'kolorist'

async function release() {
  console.log(cyan('Fetching origin...'))
  spawn.sync('git', ['pull'], { stdio: 'inherit' })

  console.log(cyan('Upgrading dependencies...'))
  spawn.sync('pnpm', ['up'], { stdio: 'inherit' })

  console.log(cyan('Linting staged...'))
  if (spawn.sync('npx', ['lint-staged'], { stdio: 'inherit' }).status === 1) {
    return
  }

  console.log(cyan('Unit testing...'))
  if (spawn.sync('pnpm', ['test-unit'], { stdio: 'inherit' }).status === 1) {
    return
  }

  console.log(cyan('Building...'))
  if (spawn.sync('pnpm', ['build'], { stdio: 'inherit' }).status === 1) {
    return
  }

  console.log(cyan('Packing...'))
  spawn.sync('npm', ['pack'], { stdio: 'inherit' })

  const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
  const { version: currentVersion } = pkg

  const choices = Array.from(['patch', 'minor', 'major'], title => ({
    title,
    value: semver.inc(currentVersion, title as semver.ReleaseType),
  }))
    .concat(Array.from(['prerelease'], title => ({
      title,
      value: title,
    })))
    .concat(Array.from(['custom'], title => ({
      title,
      value: title,
    })))

  const { t } = (await prompts({
    type: 'select',
    name: 't',
    message: 'Select release type',
    choices,
  }))

  const targetVersion = t === 'prerelease'
    ? (await prompts({
        type: 'select',
        name: 'value',
        message: 'Select prerelease type',
        choices: Array.from(['alpha', 'beta', 'rc'], title => ({
          title,
          value: semver.inc(currentVersion, 'prerelease'),
        })),
      })).value
    : t === 'custom'
      ? (await prompts({
          type: 'text',
          name: 'value',
          message: 'Input custom version',
        })).value
      : t

  if (!semver.valid(targetVersion)) {
    throw new Error(`invalid target version: ${targetVersion}`)
  }

  const { yes } = await prompts({
    type: 'confirm',
    name: 'yes',
    message: `Releasing v${targetVersion}. Confirm?`,
  })

  if (!yes) {
    return
  }

  pkg.version = targetVersion
  fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2))

  console.log(cyan('Publishing...'))
  if (spawn.sync('npm', ['publish', '--registry=https://registry.npmjs.org'], { stdio: 'inherit' }).status === 1) {
    // 恢复版本号
    pkg.version = currentVersion
    fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2))
    return
  }

  console.log(cyan('Committing...'))
  spawn.sync('git', ['add', '-A'], { stdio: 'inherit' })
  spawn.sync('git', ['commit', '-m', `release: v${targetVersion}`], { stdio: 'inherit' })

  console.log(cyan('Pushing...'))
  spawn.sync('git', ['push'], { stdio: 'inherit' })
  spawn.sync('git', ['tag', `v${targetVersion}`], { stdio: 'inherit' })
  spawn.sync('git', ['push', 'origin', `refs/tags/v${targetVersion}`], { stdio: 'inherit' })

  spawn.sync('cnpm', ['sync'], { stdio: 'inherit' })
}

try {
  release()
} catch (e) {
  console.error(e)
}
