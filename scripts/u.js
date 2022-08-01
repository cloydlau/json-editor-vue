/**
 * 更新依赖
 */

const path = require('path')
const chalk = require('chalk')
const execa = require('execa')

const mirror = 'https://registry.npmmirror.com/'
const bin = name => path.resolve(__dirname, '../node_modules/.bin/' + name)
const run = (bin, args, opts = {}) =>
  execa(bin, args, { stdio: 'inherit', ...opts })
const step = msg => console.log(chalk.cyan(msg))

async function main () {
  step('\nChecking pnpm version...')
  const currVersion = await run('pnpm', ['-v'], { stdio: 'pipe' })
  const latestVersion = await run('npm', ['view', 'pnpm', 'version'], { stdio: 'pipe' })

  if (currVersion.stdout !== latestVersion.stdout) {
    step(`\nFound new pnpm version ${latestVersion.stdout}, updating...`)
    await run('npm', ['add', 'pnpm', '-g'])

    step('\nSetting pnpm registry...')
    await run('pnpm', ['config', 'set', 'registry', mirror])
  }

  step('\nUpdating dependencies...')
  await run('pnpm', ['upgrade'])

  console.log()
}

main().catch(err => {
  console.error(err)
})
