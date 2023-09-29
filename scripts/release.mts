// pnpm add prompts semver cross-spawn kolorist del -D -w

import fs from 'node:fs'
import prompts from 'prompts'
import * as semver from 'semver'
import type { SemVer } from 'semver'
import spawn from 'cross-spawn'
import { cyan } from 'kolorist'
import { deleteAsync } from 'del'

const docsPath = ['./README.md', './docs/README.zh-CN.md']

async function release() {
  console.log(cyan('Fetching origin...'))
  if (spawn.sync('git', ['pull'], { stdio: 'inherit' }).status === 1) {
    return
  }

  console.log(cyan('Upgrading dependencies...'))
  if (spawn.sync('pnpm', ['up'], { stdio: 'inherit' }).status === 1) {
    return
  }

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
  if (spawn.sync('npm', ['pack'], { stdio: 'inherit' }).status === 1) {
    return
  }
  await deleteAsync(['./*.tgz'])

  const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
  const { name, version: currentVersion } = pkg

  const choices = Array.from(['patch', 'minor', 'major'], title => ({
    title,
    value: semver.inc(currentVersion, title as semver.ReleaseType),
  }))
    .concat(Array.from(['prerelease'], title => ({
      title,
      value: title,
    })))
    .concat(Array.from(['prepatch'], title => ({
      title,
      value: title,
    })))
    .concat(Array.from(['preminor'], title => ({
      title,
      value: title,
    })))
    .concat(Array.from(['premajor'], title => ({
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

  let targetVersion = t

  if (t.startsWith('pre')) {
    targetVersion = (await prompts({
      type: 'select',
      name: 'value',
      message: 'Select prerelease type',
      choices: Array.from(['alpha', 'beta', 'rc'], title => ({
        title,
        value: semver.inc(currentVersion, t, title),
      })),
    })).value
  } else if (t === 'custom') {
    targetVersion = (await prompts({
      type: 'text',
      name: 'value',
      message: 'Input custom version',
    })).value
  }

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

  if (['minor', 'major'].includes(t)) {
    const parsedCurrentVersion = semver.parse(currentVersion) as SemVer
    const parsedTargetVersion = semver.parse(targetVersion) as SemVer
    const pattern = new RegExp(`${name}@${parsedCurrentVersion.major}.${parsedCurrentVersion.minor}`, 'g')
    const replacement = `${name}@${parsedTargetVersion.major}.${parsedTargetVersion.minor}`
    docsPath.forEach((docPath) => {
      fs.writeFileSync(docPath, fs.readFileSync(docPath, 'utf-8').replace(pattern, replacement))
    })
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
  if (spawn.sync('git', ['add', '-A'], { stdio: 'inherit' }).status === 1) {
    return
  }
  if (spawn.sync('git', ['commit', '-m', `release: v${targetVersion}`], { stdio: 'inherit' }).status === 1) {
    return
  }

  console.log(cyan('Pushing...'))
  if (spawn.sync('git', ['push'], { stdio: 'inherit' }).status === 1) {
    return
  }
  if (spawn.sync('git', ['tag', `v${targetVersion}`], { stdio: 'inherit' }).status === 1) {
    return
  }
  if (spawn.sync('git', ['push', 'origin', `refs/tags/v${targetVersion}`], { stdio: 'inherit' }).status === 1) {
    return
  }

  spawn.sync('cnpm', ['sync'], { stdio: 'inherit' })
}

try {
  release()
} catch (e) {
  console.error(e)
}
