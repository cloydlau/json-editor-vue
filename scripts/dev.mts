// pnpm add esno prompts cross-spawn kolorist magicast -D -w

import fs from 'node:fs'
import { execSync } from 'node:child_process'
import prompts from 'prompts'
import spawn from 'cross-spawn'
import { loadFile, writeFile } from 'magicast'
import type { ASTNode } from 'magicast'
import { cyan } from 'kolorist'
import { addVitePlugin } from 'magicast/helpers'

declare const process: NodeJS.Process

type VueVersion = '3' | '2.7' | '2.6'

const vueVersion: VueVersion[] = ['3', '2.7', '2.6']

const vueVersionToVitePlugin: Record<VueVersion, string> = {
  3: '@vitejs/plugin-vue',
  2.7: '@vitejs/plugin-vue2',
  2.6: 'vite-plugin-vue2',
}

const vueVersionToDeps: Record<VueVersion, Record<string, string>> = {
  3: {
    '@vitejs/plugin-vue': 'latest',
    '@vue/compiler-sfc': 'latest',
    '@vue/test-utils': 'latest',
    'vue': 'latest',
  },
  2.7: {
    '@vitejs/plugin-vue2': 'latest',
    '@vue/test-utils': 'legacy',
    'vue': '~2.7.14',
    'vue-template-compiler': '~2.7.14',
  },
  2.6: {
    '@vue/composition-api': 'latest',
    '@vue/test-utils': 'legacy',
    'vite-plugin-vue2': 'latest',
    'unplugin-vue2-script-setup': 'latest',
    'vue': '~2.6.14',
    'vue-template-compiler': '~2.6.14',
  },
}

async function dev() {
  const { targetVersion }: { targetVersion: VueVersion } = await prompts({
    type: 'select',
    name: 'targetVersion',
    message: 'Select Vue version',
    choices: Array.from(vueVersion, value => ({ title: value, value })),
  })

  if (!targetVersion) {
    return
  }

  console.log(cyan('Fetching origin...'))
  spawn('git', ['pull'], { stdio: 'inherit' })

  console.log(cyan(`Switching to Vue ${targetVersion}...`))
  const mod = await loadFile('./vite.config.ts')

  // imported 表示命名导入的值，默认导入是 default
  // k 和 mod.imports[k].local 和 constructor 三者一致，表示导入取的别名

  // 删掉 vue 相关引入
  const existedVuePlugins: Record<string, boolean> = {}
  for (const k in mod.imports) {
    for (const vueVersion in vueVersionToVitePlugin) {
      if (mod.imports[k] && [vueVersionToVitePlugin[vueVersion as VueVersion], 'unplugin-vue2-script-setup/vite'].includes(mod.imports[k].from)) {
        delete mod.imports[k]
        existedVuePlugins[k] = true
      }
    }
  }

  // 删掉 vue 相关插件
  const options = mod.exports.default.$type === 'function-call'
    ? mod.exports.default.$args[0]
    : mod.exports.default
  if (Object.keys(existedVuePlugins).length && options.plugins?.length) {
    for (let i = options.plugins.length - 1; i > 0; i--) {
      const p = options.plugins[i]
      if (p?.$type === 'function-call' && existedVuePlugins[p.$callee]) {
        options.plugins.splice(i, 1)
      }
    }
  }

  // 添加 vue 相关插件
  addVitePlugin(mod, {
    from: vueVersionToVitePlugin[targetVersion],
    imported: targetVersion === '2.6' ? 'createVuePlugin' : 'default',
    constructor: 'vue',
  })
  if (targetVersion === '2.6') {
    addVitePlugin(mod, {
      from: 'unplugin-vue2-script-setup/vite',
      imported: 'default',
      constructor: 'ScriptSetup',
    })
  }

  await writeFile(mod as unknown as ASTNode, './vite.config.ts')
  spawn('npx', ['eslint', './vite.config.ts', '--fix'], { stdio: 'inherit' })

  let isDepsChanged = false

  const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))

  for (const ver in vueVersionToDeps) {
    if (ver !== targetVersion) {
      for (const deps in vueVersionToDeps[ver as VueVersion]) {
        // 删除非目标版本的依赖
        // peerDependencies 中的依赖会被 pnpm 自动添加，不删除
        if (pkg.devDependencies[deps] && !vueVersionToDeps[targetVersion][deps] && !pkg.peerDependencies[deps]) {
          delete pkg.devDependencies[deps]
          isDepsChanged = true
        }
      }
    }
  }

  for (const targetDeps in vueVersionToDeps[targetVersion]) {
    // 添加目标版本的依赖
    if (pkg.devDependencies[targetDeps] !== vueVersionToDeps[targetVersion][targetDeps]) {
      pkg.devDependencies[targetDeps] = vueVersionToDeps[targetVersion][targetDeps]
      isDepsChanged = true
    }
  }

  if (isDepsChanged) {
    fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2))
    console.log(cyan('Linting package.json...'))
    spawn('npx', ['eslint', './package.json', '--fix'], { stdio: 'inherit' })
    await installDependencies()
  }

  spawn.sync('npx', ['vite', '--open'], { stdio: 'inherit' })

  async function installDependencies() {
    if (['darwin', 'linux'].includes(process.platform)) {
      console.log(cyan('Checking pnpm version...'))
      const latestPNPMVersion = spawn.sync('npm', ['view', 'pnpm', 'version']).stdout.toString().trim()
      const currentPNPMVersion = spawn.sync('pnpm', ['-v']).stdout.toString().trim()
      // Mac 自带 curl，Linux 不一定，Windows 不支持指定 pnpm 版本
      if (latestPNPMVersion !== currentPNPMVersion) {
        console.log(cyan('Upgrading pnpm...'))
        try {
          console.log(execSync(`curl -fsSL https://get.pnpm.io/install.sh | env PNPM_VERSION=${latestPNPMVersion} sh -`).toString())
          /* const curlProcess = spawn.sync('curl', ['-fsSL', 'https://get.pnpm.io/install.sh'], {
            env: { PNPM_VERSION: latestPNPMVersion },
            stdio: ['pipe', 'pipe', 'pipe'], // Redirect stdin, stdout, and stderr
          })
          if (curlProcess.status === 0) {
            // If curl was successful, execute the shell command
            const shCommand = 'sh'
            const shArgs = ['-']

            const shProcess = spawn.sync(shCommand, shArgs, {
              input: curlProcess.stdout, // Pass the stdout of curl as input to sh
              stdio: ['pipe', 'inherit', 'inherit'], // Redirect stdin, inherit stdout and stderr
            })

            if (shProcess.status === 0) {
              console.log('pnpm installation successful.')
            } else {
              console.error('pnpm installation failed.')
            }
          } else {
            console.error('curl command failed.')
          } */
          console.log(cyan('Setting registry...'))
          spawn.sync('pnpm', ['config', 'set', 'registry', 'https://registry.npmmirror.com'], { stdio: 'inherit' })
          console.log(cyan('Installing node lts...'))
          spawn.sync('pnpm', ['env', 'use', '-g', 'lts'], { stdio: 'inherit' })
          console.log(cyan('Installing global packages...'))
          spawn('pnpm', ['add', 'cnpm', '@antfu/ni', 'only-allow', '-g'], { stdio: 'inherit' })
        } catch (e) {

        }
      }
    }
    console.log(cyan('Installing dependencies...'))
    spawn.sync('pnpm', ['i'], { stdio: 'inherit' })
    spawn.sync('npx', ['vue-demi-switch', targetVersion === '2.6' ? '2' : targetVersion], { stdio: 'inherit' })
  }
}

try {
  dev()
} catch (e) {
  console.error(e)
}
