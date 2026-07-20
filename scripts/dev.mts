// pnpm i only-allow esno prompts cross-spawn magicast del -D -w

import fs from 'node:fs'
import { styleText } from 'node:util'
import spawn from 'cross-spawn'
import { destr } from 'destr'
import { loadFile, writeFile } from 'magicast'
import { addVitePlugin } from 'magicast/helpers'
import ncu from 'npm-check-updates'
import prompts from 'prompts'

const cyan = (text: string) => styleText('cyan', text)

type VueVersion = '3' | '2.7' | '2.6'

const vueVersion: VueVersion[] = ['3', '2.7', '2.6']

const toVitePlugin: Record<VueVersion, string> = {
  3: '@vitejs/plugin-vue',
  2.7: '@vitejs/plugin-vue2',
  2.6: 'vite-plugin-vue2',
}

const toPackageOptions: Record<VueVersion, Record<string, Record<string, any>>> = {
  3: {
    devDependencies: {
      '@vitejs/plugin-vue': 'latest',
      '@vue/compiler-sfc': 'latest',
      '@vue/test-utils': 'latest',
      'vue': 'latest',
    },
  },
  2.7: {
    devDependencies: {
      '@vitejs/plugin-vue2': 'latest',
      '@vue/test-utils': 'legacy',
      'vue': '~2.7',
      'vue-template-compiler': '~2.7',
    },
  },
  2.6: {
    devDependencies: {
      '@vue/composition-api': 'latest',
      '@vue/test-utils': 'legacy',
      'vite-plugin-vue2': 'latest',
      'unplugin-vue2-script-setup': 'latest',
      'vue': '~2.6',
      'vue-template-compiler': '~2.6',
    },
  },
}

/**
 * 解析配置中的版本约束，供 ncu 查询具体版本。
 * - latest → 最新版，写入 ^x.y.z
 * - ^N → 大版本 N 内最新，写入 ^x.y.z
 * - ~N.M → 中版本 N.M 内最新，写入 ~x.y.z
 */
function parseVersionConstraint(version: unknown): {
  prefix: '^' | '~'
  seed: string
  target: 'latest' | 'minor' | 'patch'
} | null {
  if (typeof version !== 'string') {
    return null
  }
  if (version === 'latest') {
    return { prefix: '^', seed: '0.0.0', target: 'latest' }
  }
  const caretMajor = version.match(/^\^(\d+)$/)
  if (caretMajor) {
    return { prefix: '^', seed: `${caretMajor[1]}.0.0`, target: 'minor' }
  }
  const tildeMinor = version.match(/^~(\d+)\.(\d+)$/)
  if (tildeMinor) {
    return { prefix: '~', seed: `${tildeMinor[1]}.${tildeMinor[2]}.0`, target: 'patch' }
  }
  return null
}

/**
 * 将依赖配置中的 latest / ^major / ~major.minor 解析为带冷却期的具体版本范围。
 * @param packageOptions 当前 Vue 版本对应的依赖配置
 */
async function resolveDependencyVersions(packageOptions: Record<string, Record<string, any>>) {
  const pending: Array<{
    option: string
    name: string
    prefix: '^' | '~'
    seed: string
    target: 'latest' | 'minor' | 'patch'
  }> = []

  for (const [option, dependencies] of Object.entries(packageOptions)) {
    for (const [name, version] of Object.entries(dependencies)) {
      const constraint = parseVersionConstraint(version)
      if (constraint) {
        pending.push({ option, name, ...constraint })
      }
    }
  }

  if (!pending.length) {
    return
  }

  const byTarget: Record<'latest' | 'minor' | 'patch', typeof pending> = {
    latest: [],
    minor: [],
    patch: [],
  }
  for (const item of pending) {
    byTarget[item.target].push(item)
  }

  for (const target of ['latest', 'minor', 'patch'] as const) {
    const deps = byTarget[target]
    if (!deps.length) {
      continue
    }

    const packageData: Record<string, Record<string, string>> = {}
    for (const { option, name, seed } of deps) {
      packageData[option] ||= {}
      packageData[option][name] = seed
    }

    const upgrades = await ncu({
      cooldown: '1d',
      packageData,
      packageManager: 'pnpm',
      target,
      jsonUpgraded: true,
      silent: true,
    }) as Record<string, string>

    for (const { option, name, prefix, seed } of deps) {
      const resolved = upgrades[name] ?? (target === 'latest' ? undefined : seed)
      if (!resolved) {
        throw new Error(`无法获取 ${name} 的版本`)
      }
      const version = resolved.replace(/^[~^]/, '')
      const versionRange = `${prefix}${version}`
      packageOptions[option][name] = versionRange
      console.info(cyan(`Resolved ${name}@${versionRange}`))
    }
  }
}

const vueRelatedPlugins = new Set([
  ...Object.values(toVitePlugin),
  'unplugin-vue2-script-setup/vite',
])

/** 已是目标 Vue 插件组合时跳过写盘，避免无谓改动触发 Vite 重启。 */
function needsViteConfigSwitch(mod: Awaited<ReturnType<typeof loadFile>>, targetVersion: VueVersion) {
  const current = Object.values(mod.imports)
    .filter((item): item is NonNullable<typeof item> => Boolean(item) && vueRelatedPlugins.has(item.from))
    .map(item => item.from)
  const expected = targetVersion === '2.6'
    ? [toVitePlugin[targetVersion], 'unplugin-vue2-script-setup/vite']
    : [toVitePlugin[targetVersion]]
  return current.length !== expected.length || expected.some(pkg => !current.includes(pkg))
}

// 按当前 Vue 大版本同步 ESLint 的 vueVersion：Vue 2 写入配置，Vue 3 删除。
function syncEslintVueVersion(targetVersion: VueVersion) {
  const eslintConfigPath = './eslint.config.mjs'
  const vue2OptionLine = '    vue: { vueVersion: 2 },\n'
  const lessOpinionatedLine = '    lessOpinionated: true,\n'
  let content = fs.readFileSync(eslintConfigPath, 'utf-8')
  content = content.replace(/\n {4}vue: \{ vueVersion: 2 \},\n/, '\n')
  if (targetVersion !== '3') {
    if (!content.includes(vue2OptionLine)) {
      if (!content.includes(lessOpinionatedLine)) {
        throw new Error('eslint.config.mjs 中未找到 lessOpinionated: true')
      }
      content = content.replace(lessOpinionatedLine, `${lessOpinionatedLine}${vue2OptionLine}`)
    }
  }
  fs.writeFileSync(eslintConfigPath, content)
}

// 切换开发环境的 Vue 版本并启动 Vite。
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

  await resolveDependencyVersions(toPackageOptions[targetVersion])

  console.info(cyan('Fetching origin...'))
  spawn('git', ['pull'], { stdio: 'inherit' })

  console.info(cyan(`Switching to Vue ${targetVersion}...`))
  syncEslintVueVersion(targetVersion)
  const mod = await loadFile('./vite.config.mts')

  // 只在需要切换 Vue 插件时写 vite.config：启动路径不做 eslint --fix。
  // 异步 fix 会在 Vite ready 后改写被 watch 的文件，触发半截 restart；同步 fix 又会拖慢每次 dev。
  if (needsViteConfigSwitch(mod, targetVersion)) {
    // imported 表示命名导入的值，默认导入是 default
    // k 和 mod.imports[k].local 和 constructor 三者一致，表示导入取的别名

    // 删掉 vue 相关引入
    const existedVuePlugins: Record<string, boolean> = {}
    for (const k in mod.imports) {
      for (const ver of vueVersion) {
        if (mod.imports[k] && [toVitePlugin[ver], 'unplugin-vue2-script-setup/vite'].includes(mod.imports[k].from)) {
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
      from: toVitePlugin[targetVersion],
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

    await writeFile(mod, './vite.config.mts')
  }

  let isDepsChanged = false

  const pkg = destr(fs.readFileSync('./package.json', 'utf-8')) as JSON

  // 删除非目标版本的依赖
  for (const ver of vueVersion) {
    if (ver !== targetVersion) {
      for (const option in toPackageOptions[ver]) {
        for (const dep in toPackageOptions[ver][option]) {
          if (pkg[option][dep] && !toPackageOptions[targetVersion][option][dep]) {
            delete pkg[option][dep]
            isDepsChanged = true
          }
        }
      }
    }
  }

  // 添加目标版本的依赖
  for (const option in toPackageOptions[targetVersion]) {
    for (const dep in toPackageOptions[targetVersion][option]) {
      const depVer = toPackageOptions[targetVersion][option][dep]
      if (pkg[option][dep] !== depVer) {
        pkg[option][dep] = depVer
        isDepsChanged = true
      }
    }
  }

  if (isDepsChanged) {
    fs.writeFileSync('./package.json', `${JSON.stringify(pkg, null, 2)}\n`)
    await installDependencies()
  }

  spawn.sync('npx', ['vite', '--open', '--force'], { stdio: 'inherit' })

  async function installDependencies() {
    /* if (['darwin', 'linux'].includes(process.platform)) {
      console.info(cyan('Checking pnpm version...'))
      const latestPNPMVersion = spawn.sync('npm', ['view', 'pnpm', 'version']).stdout.toString().trim()
      const currentPNPMVersion = spawn.sync('pnpm', ['-v']).stdout.toString().trim()
      // Mac 自带 curl，Linux 不一定，Windows 不支持指定 pnpm 版本
      if (latestPNPMVersion !== currentPNPMVersion) {
        console.info(cyan('Upgrading pnpm...'))
        try {
          console.info(execSync(`curl -fsSL https://get.pnpm.io/install.sh | env PNPM_VERSION=${latestPNPMVersion} sh -`).toString())
          // const curlProcess = spawn.sync('curl', ['-fsSL', 'https://get.pnpm.io/install.sh'], {
          //   env: { PNPM_VERSION: latestPNPMVersion },
          //   stdio: ['pipe', 'pipe', 'pipe'], // Redirect stdin, stdout, and stderr
          // })
          // if (curlProcess.status === 0) {
          //   // If curl was successful, execute the shell command
          //   const shCommand = 'sh'
          //   const shArgs = ['-']
          //
          //   const shProcess = spawn.sync(shCommand, shArgs, {
          //     input: curlProcess.stdout, // Pass the stdout of curl as input to sh
          //     stdio: ['pipe', 'inherit', 'inherit'], // Redirect stdin, inherit stdout and stderr
          //   })
          //
          //   if (shProcess.status === 0) {
          //     console.info('pnpm installation successful.')
          //   } else {
          //     console.error('pnpm installation failed.')
          //   }
          // } else {
          //   console.error('curl command failed.')
          // }
          console.info(cyan('Setting registry...'))
          spawn.sync('pnpm', ['config', 'set', 'registry', 'https://registry.npmmirror.com'], { stdio: 'inherit' })
          // console.info(cyan('Installing node lts...'))
          // spawn.sync('pnpm', ['env', 'use', '-g', 'lts'], { stdio: 'inherit' })
          console.info(cyan('Installing global packages...'))
          spawn('pnpm', ['add', 'cnpm', '@antfu/ni', '-g'], { stdio: 'inherit' })
          console.info(cyan('Deleting ./node_modules...'))
          await deleteAsync(['./node_modules'])
        } catch (e) {

        }
      }
    } */
    console.info(cyan('Installing dependencies...'))
    spawn.sync('pnpm', ['i'], { stdio: 'inherit' })
    spawn.sync('npx', ['vue-demi-switch', targetVersion === '2.6' ? '2' : targetVersion], { stdio: 'inherit' })
  }
}

try {
  await dev()
}
catch (e) {
  console.error(e)
}
