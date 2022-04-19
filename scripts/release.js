/**
 * 发版
 * - pnpm add chalk@^4.1.2 enquirer execa@^4.1.0 minimist semver -D: 需要安装的依赖
 * - "release": "node scripts/release.js": package.json - scripts
 * - pnpm release: 打包 + 发布 + Push + Tag
 */

const args = require('minimist')(process.argv.slice(2))
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const semver = require('semver')
const currentVersion = require('../package.json').version
const pkg = require('../package.json').name
const { prompt } = require('enquirer')
const execa = require('execa')

const preId =
  args.preid ||
  (semver.prerelease(currentVersion) && semver.prerelease(currentVersion)[0])
const isDryRun = args.dry
//const skipTests = args.skipTests
const straightforward = args.straightforward

const versionIncrements = [
  'patch',
  'minor',
  'major',
  ...(preId ? ['prepatch', 'preminor', 'premajor', 'prerelease'] : [])
]

const inc = i => semver.inc(currentVersion, i, preId)
const bin = name => path.resolve(__dirname, '../node_modules/.bin/' + name)
const run = (bin, args, opts = {}) =>
  execa(bin, args, { stdio: 'inherit', ...opts })
const dryRun = (bin, args, opts = {}) =>
  console.log(chalk.blue(`[dryrun] ${bin} ${args.join(' ')}`), opts)
const runIfNotDry = isDryRun ? dryRun : run
const step = msg => console.log(chalk.cyan(msg))

async function main () {
  let targetVersion = args._[0]

  if (straightforward) {
    targetVersion = currentVersion
  } else {
    if (!targetVersion) {
      // no explicit version, offer suggestions
      const { release } = await prompt({
        type: 'select',
        name: 'release',
        message: 'Select release type',
        choices: versionIncrements.map(i => `${i} (${inc(i)})`).concat(['custom'])
      })

      if (release === 'custom') {
        targetVersion = (
          await prompt({
            type: 'input',
            name: 'version',
            message: 'Input custom version',
            initial: currentVersion
          })
        ).version
      } else {
        targetVersion = release.match(/\((.*)\)/)[1]
      }
    }

    if (!semver.valid(targetVersion)) {
      throw new Error(`invalid target version: ${targetVersion}`)
    }

    const { yes } = await prompt({
      type: 'confirm',
      name: 'yes',
      message: `Releasing v${targetVersion}. Confirm?`
    })

    if (!yes) {
      return
    }

    // run tests before release
    /*step('\nRunning tests...')
    if (!skipTests && !isDryRun) {
      await run(bin('jest'), ['--clearCache'])
      await run('pnpm', ['test', '--', '--bail'])
    } else {
      console.log(`(skipped)`)
    }*/

    step('\nUpdating version...')
    updateVersions(targetVersion)

    // build all packages with types
    step('\nBuilding...')
    if (!isDryRun) {
      await run('pnpm', ['run', 'build'])
      // test generated dts files
      //step('\nVerifying type declarations...')
      //await run('pnpm', ['run', 'test-dts-only'])
    } else {
      console.log(`(skipped)`)
    }
  }

  // generate changelog
  //step('\nGenerating changelog...')
  //await run(`pnpm`, ['run', 'changelog'])

  // update pnpm-lock.yaml
  //step('\nUpdating lockfile...')
  //await run(`pnpm`, ['install', '--prefer-offline'])

  // publish packages
  step('\nPublishing...')
  await publishPackage(pkg, targetVersion, runIfNotDry)

  const { stdout } = await run('git', ['diff'], { stdio: 'pipe' })
  if (stdout) {
    step('\nCommitting changes...')
    await runIfNotDry('git', ['add', '-A'])
    await runIfNotDry('git', ['commit', '-m', `release: v${targetVersion}`])
  } else {
    console.log('No changes to commit.')
  }

  // push to GitHub
  step('\nPushing to GitHub...')
  await runIfNotDry('git', ['tag', `v${targetVersion}`])
  await runIfNotDry('git', ['push', 'origin', `refs/tags/v${targetVersion}`])
  await runIfNotDry('git', ['push'])

  if (isDryRun) {
    console.log(`\nDry run finished - run git diff to see package changes.`)
  }

  console.log()
}

function updateVersions (version) {
  // update root package.json
  updatePackage(path.resolve(__dirname, '..'), version)
}

function updatePackage (pkgRoot, version) {
  const pkgPath = path.resolve(pkgRoot, 'package.json')
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))
  pkg.version = version
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n')
}

async function publishPackage (pkgName, version, runIfNotDry) {
  const releaseTag = semver.prerelease(version) && semver.prerelease(version)[0] || null

  step(`Publishing ${pkgName}...`)
  await runIfNotDry('npm', ['config', 'delete', 'registry'])
  try {
    /*await runIfNotDry(
      // note: use of yarn is intentional here as we rely on its publishing
      // behavior.
      'yarn',
      [
        'publish',
        '--new-version',
        version,
        ...(releaseTag ? ['--tag', releaseTag] : []),
        '--access',
        'public'
      ],
      {
        //cwd: pkgRoot,
        stdio: 'pipe'
      }
    )*/
    await runIfNotDry('npm', ['publish'])
    console.log(chalk.green(`Successfully published ${pkgName}@${version}`))
  } catch (e) {
    if (e.stderr.match(/previously published/)) {
      console.log(chalk.red(`Skipping already published: ${pkgName}`))
    } else {
      throw e
    }
  }
  await runIfNotDry('pnpm', ['config', 'set', 'registry', 'https://registry.npmmirror.com/'])

  runIfNotDry('cnpm', ['sync', pkgName])
  runIfNotDry('explorer', [`https://npmmirror.com/sync/${pkgName}`])
}

main().catch(async err => {
  console.error(err)
  //await runIfNotDry('git', ['reset', '--soft', 'HEAD~1'])
  //updateVersions(currentVersion)
})
