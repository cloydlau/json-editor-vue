import fs from 'node:fs'
import { cyan } from 'ansis'
import spawn from 'cross-spawn'
// import { deleteAsync } from 'del'
import prompts from 'prompts'
import * as semver from 'semver'

const docsPath = ['./README.md', './docs/README.zh-CN.md']

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

  console.info(cyan('\nBuilding...'))
  if (spawn.sync('pnpm', ['build'], { stdio: 'inherit' }).status === 1) {
    return
  }

  console.info(cyan('\nPublinting...'))
  if (spawn.sync('pnpm', ['exec', 'publint'], { stdio: 'inherit' }).status === 1) {
    return
  }

  /* console.info(cyan('\nAnalyzing types...'))
  const attw = spawn.sync('pnpm', ['exec', 'attw', '$(npm pack)'], { stdio: 'inherit' })
  await deleteAsync(['./*.tgz'])
  if (attw.status === 1) {
    return
  } */

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

  /**
   * 发布时临时去掉 postinstall，避免终端用户安装时触发 pnpm approve-builds。
   * 用内存快照还原磁盘文件，不改动 git 已提交内容。
   * @returns action 的返回值；失败时请返回 false
   */
  function withStrippedPostinstall(action: () => boolean): boolean {
    const packageJsonPath = './package.json'
    const snapshot = fs.readFileSync(packageJsonPath, 'utf-8')
    const pkg = JSON.parse(snapshot) as { scripts?: Record<string, string> }
    if (pkg.scripts?.postinstall) {
      delete pkg.scripts.postinstall
      fs.writeFileSync(packageJsonPath, `${JSON.stringify(pkg, null, 2)}\n`)
    }
    try {
      return action()
    }
    finally {
      fs.writeFileSync(packageJsonPath, snapshot)
    }
  }

  const published = withStrippedPostinstall(() => {
    console.info(cyan('\nPublishing to npm...'))
    if (spawn.sync('npm', ['publish', '--registry=https://registry.npmjs.org', '--access=public'], { stdio: 'inherit' }).status === 1) {
      console.info(cyan('\nPublish failed. You can retry manually:\n'))
      console.info('  npm publish --registry=https://registry.npmjs.org --access=public')
      console.info('  pnpm exec cnpm sync')
      console.info(`  curl -L https://npmmirror.com/sync/${name}`)
      return false
    }

    // 异步触发 cnpm 镜像同步，无需等待完成
    console.info(cyan('\nSync to cnpm...'))
    spawn('pnpm', ['exec', 'cnpm', 'sync'], { stdio: 'inherit' })
    spawn('curl', ['-L', `https://npmmirror.com/sync/${name}`], { stdio: 'inherit' })
    return true
  })
  if (!published) {
    return
  }
}

release().catch(console.error)
