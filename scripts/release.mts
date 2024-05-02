// pnpm i esno prompts semver cross-spawn kolorist del open -D -w

import fs from 'node:fs'
import prompts from 'prompts'
import * as semver from 'semver'
import spawn from 'cross-spawn'
import { cyan } from 'kolorist'
import { deleteAsync } from 'del'
import open from 'open'

const docsPath = ['./README.md', './docs/README.zh-CN.md']

async function release() {
  console.log(cyan('Fetching origin...'))
  if (spawn.sync('git', ['pull'], { stdio: 'inherit' }).status === 1) {
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

  const jsrConfig = JSON.parse(fs.readFileSync('./jsr.json', 'utf-8'))
  const npmConfig = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
  // 假定 jsr 版本号与 npm 一致
  const { name, version: currentVersion } = npmConfig

  const choices = Array.from(['patch', 'minor', 'major', 'prerelease', 'prepatch', 'preminor', 'premajor', 'custom'], title => ({
    title,
    value: title,
  }))

  const { releaseType } = (await prompts({
    type: 'select',
    name: 'releaseType',
    message: 'Select release type',
    choices,
  }))

  const parsedCurrentVersion = semver.parse(currentVersion)
  let targetVersion

  if (['patch', 'minor', 'major'].includes(releaseType)) {
    targetVersion = semver.inc(currentVersion, releaseType)
  }
  else if (releaseType.startsWith('pre')) {
    // 只升 prerelease 版本时，已经是 beta 阶段就不可能再回到 alpha 阶段
    let prereleaseTypes = ['alpha', 'beta', 'rc']
    if (releaseType === 'prerelease') {
      const i = prereleaseTypes.indexOf(String(parsedCurrentVersion?.prerelease[0]))
      if (i !== -1) {
        prereleaseTypes = prereleaseTypes.slice(i)
      }
    }

    targetVersion = prereleaseTypes.length === 1
      // 已经是 rc 阶段就不用选了
      ? semver.inc(currentVersion, releaseType, prereleaseTypes[0])
      : (await prompts({
          type: 'select',
          name: 'value',
          message: 'Select prerelease type',
          choices: Array.from(prereleaseTypes, title => ({
            title,
            value: semver.inc(currentVersion, releaseType, title),
          })),
        })).value
  }
  else {
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

  if (['minor', 'major'].includes(releaseType)) {
    const parsedTargetVersion = semver.parse(targetVersion)
    if (parsedCurrentVersion && parsedTargetVersion) {
      const pattern = new RegExp(`${name}@${parsedCurrentVersion.major}.${parsedCurrentVersion.minor}`, 'g')
      const replacement = `${name}@${parsedTargetVersion.major}.${parsedTargetVersion.minor}`
      docsPath.forEach((docPath) => {
        fs.writeFileSync(docPath, fs.readFileSync(docPath, 'utf-8').replace(pattern, replacement))
      })
    }
  }

  jsrConfig.version = targetVersion
  npmConfig.version = targetVersion
  fs.writeFileSync('./jsr.json', JSON.stringify(jsrConfig, null, 2))
  fs.writeFileSync('./package.json', JSON.stringify(npmConfig, null, 2))

  console.log(cyan('Committing...'))
  if (spawn.sync('git', ['add', '-A'], { stdio: 'inherit' }).status === 1) {
    return
  }
  if (spawn.sync('git', ['commit', '-m', `release: v${targetVersion}`], { stdio: 'inherit' }).status === 1) {
    // pre-commit 时如果 lint 失败，则恢复版本号
    jsrConfig.version = currentVersion
    npmConfig.version = currentVersion
    fs.writeFileSync('./jsr.json', JSON.stringify(jsrConfig, null, 2))
    fs.writeFileSync('./package.json', JSON.stringify(npmConfig, null, 2))
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

  console.log(cyan('Publishing to jsr...'))
  if (spawn.sync('npx', ['jsr', 'publish'], { stdio: 'inherit' }).status === 1) {
    return
  }

  console.log(cyan('Publishing to npm...'))
  if (spawn.sync('npm', ['publish', '--registry=https://registry.npmjs.org'], { stdio: 'inherit' }).status === 1) {
    return
  }

  console.log(cyan('Updating JSR version badge...'))
  spawn.sync('curl', ['-X', 'PURGE', 'https://camo.githubusercontent.com/91e166dfe66fd00a4c307d2f3d47c87c1e2442f8964d3385642afab3c0e62b00/68747470733a2f2f6a73722e696f2f6261646765732f40636c6f79646c61752f6a736f6e2d656469746f722d767565'], { stdio: 'inherit' })

  console.log(cyan('Updating npmmirror...'))
  spawn.sync('cnpm', ['sync'], { stdio: 'inherit' })
  open(`https://npmmirror.com/sync/${name}`)
}

try {
  release()
}
catch (e) {
  console.error(e)
}
