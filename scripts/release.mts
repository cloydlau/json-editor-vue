import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { styleText } from 'node:util'
import { gzipSync } from 'node:zlib'
import spawn from 'cross-spawn'
import prompts from 'prompts'
import * as semver from 'semver'

const docsPath = ['./README.md', './docs/README.zh-CN.md']

const cyan = (text: string) => styleText('cyan', text)

/**
 * 测量 dist 在 externalize vue（peer）后的 minify+gzip 体积，并写入 README 静态 minzip badge。
 * 避免依赖不稳定的 deno.bundlejs.com 实时 badge。
 */
function updateMinzipBadge() {
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'jev-minzip-'))
  const outfile = path.join(outDir, 'bundle.js')
  try {
    const bundled = spawn.sync('pnpm', [
      'exec',
      'esbuild',
      './dist/json-editor-vue.mjs',
      '--bundle',
      '--minify',
      '--format=esm',
      '--external:vue',
      `--outfile=${outfile}`,
    ], { stdio: 'inherit' })
    if (bundled.status !== 0) {
      throw new Error('esbuild failed while measuring minzip size')
    }

    const gzippedBytes = gzipSync(fs.readFileSync(outfile)).byteLength
    const label = `${Math.round(gzippedBytes / 1000)} kB`
    const badgeUrl = `https://img.shields.io/badge/minzip-${encodeURIComponent(label)}-3B82F6?logo=esbuild&logoColor=white`
    const pattern = /https:\/\/img\.shields\.io\/badge\/minzip-[^"'\\\s]+/g

    docsPath.forEach((docPath) => {
      const content = fs.readFileSync(docPath, 'utf-8')
      const next = content.replace(pattern, badgeUrl)
      if (next === content) {
        throw new Error(`minzip badge not found in ${docPath}`)
      }
      fs.writeFileSync(docPath, next)
    })

    console.info(cyan(`\nUpdated minzip badge to ${label}`))
  }
  finally {
    fs.rmSync(outDir, { recursive: true, force: true })
  }
}

// 执行发版流程：校验、选择版本、生成变更日志、提交并发布到 npm
async function release() {
  console.info(cyan('\nFetching origin...'))
  if (spawn.sync('git', ['pull'], { stdio: 'inherit' }).status === 1) {
    return
  }

  console.info(cyan('\nLinting staged...'))
  if (spawn.sync('pnpm', ['exec', 'lint-staged'], { stdio: 'inherit' }).status === 1) {
    return
  }

  console.info(cyan('\nUnit testing...'))
  if (spawn.sync('pnpm', ['test'], { stdio: 'inherit' }).status === 1) {
    return
  }

  console.info(cyan('\nAnalyzing types...'))
  if (spawn.sync('pnpm', ['attw'], { stdio: 'inherit' }).status === 1) {
    return
  }

  console.info(cyan('\nBuilding...'))
  if (spawn.sync('pnpm', ['build'], { stdio: 'inherit' }).status === 1) {
    return
  }

  console.info(cyan('\nPublinting...'))
  if (spawn.sync('pnpm', ['exec', 'publint'], { stdio: 'inherit' }).status === 1) {
    return
  }

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

  let account = spawn.sync('npm', ['whoami', '--registry=https://registry.npmjs.org']).stdout.toString().trim()

  if (!account) {
    console.info(cyan('\nNot logged in to npm, please login first:'))
    if (spawn.sync('npm', ['login', '--registry=https://registry.npmjs.org'], { stdio: 'inherit' }).status === 1) {
      return
    }
    account = spawn.sync('npm', ['whoami', '--registry=https://registry.npmjs.org']).stdout.toString().trim()
    if (!account) {
      console.error('Login failed, aborting release.')
      return
    }
  }

  const { yes } = await prompts({
    type: 'confirm',
    name: 'yes',
    message: `Releasing v${targetVersion} under this account: ${account}. Confirm?`,
  })

  if (!yes) {
    return
  }

  // minor/major 升级时，同步更新文档中的版本引用
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

  console.info(cyan('\nUpdating minzip badge...'))
  updateMinzipBadge()

  jsrConfig.version = targetVersion
  npmConfig.version = targetVersion
  fs.writeFileSync('./jsr.json', JSON.stringify(jsrConfig, null, 2))
  fs.writeFileSync('./package.json', JSON.stringify(npmConfig, null, 2))

  // console.info(cyan('\nGenerating changelog...'))
  // spawn.sync('node', ['./scripts/changelog.mjs'], { stdio: 'inherit' })

  console.info(cyan('\nCommitting...'))
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

  console.info(cyan('\nPushing...'))
  if (spawn.sync('git', ['push'], { stdio: 'inherit' }).status === 1) {
    return
  }
  if (spawn.sync('git', ['tag', `v${targetVersion}`], { stdio: 'inherit' }).status === 1) {
    return
  }
  if (spawn.sync('git', ['push', 'origin', `refs/tags/v${targetVersion}`], { stdio: 'inherit' }).status === 1) {
    return
  }

  // 本地不 npm publish / cnpm sync：由 tag 触发的 release.yml 负责（含 --provenance，以及 publish 前去掉 postinstall）
  console.info(cyan(`\nTag v${targetVersion} pushed. npm publish / cnpm sync will run in GitHub Actions.`))
}

release().catch(console.error)
