import fs from 'node:fs'
import prompts from 'prompts'
import * as semver from 'semver'
import spawn from 'cross-spawn'
import { cyan } from 'kolorist'

async function release() {
  console.log(cyan('Fetching origin...'))
  await spawn.sync('git pull', undefined, { stdio: 'inherit' })

  console.log(cyan('Upgrading dependencies...'))
  await spawn.sync('pnpm up', undefined, { stdio: 'inherit' })

  console.log(cyan('Linting staged...'))
  await spawn.sync('npx lint-staged', undefined, { stdio: 'inherit' })

  console.log(cyan('Unit testing...'))
  await spawn.sync('pnpm test-unit', undefined, { stdio: 'inherit' })

  console.log(cyan('Building...'))
  await spawn.sync('pnpm build', undefined, { stdio: 'inherit' })

  const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
  const { version: currentVersion, name } = pkg

  const choices = Array.from(['patch', 'minor', 'major'], title => ({
    title,
    value: semver.inc(currentVersion, name),
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
          value: semver.inc(currentVersion, 'prerelease', name),
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
  const { status } = await spawn.sync('npm publish', undefined, { stdio: 'inherit' })
  if (status === 1) {
    // 恢复版本号
    pkg.version = currentVersion
    fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2))
    return
  }

  console.log(cyan('Committing...'))
  await spawn.sync('git add -A', undefined, { stdio: 'inherit' })
  await spawn.sync(`git commit -m release: v${targetVersion}}`, undefined, { stdio: 'inherit' })

  console.log(cyan('Pushing...'))
  await spawn.sync('git push', undefined, { stdio: 'inherit' })
  await spawn.sync(`git tag v${targetVersion}`, undefined, { stdio: 'inherit' })
  await spawn.sync(`git push origin refs/tags/v${targetVersion}`, undefined, { stdio: 'inherit' })

  await spawn.sync('cnpm sync', undefined, { stdio: 'inherit' })
}

try {
  release()
} catch (e) {
  console.error(e)
}
