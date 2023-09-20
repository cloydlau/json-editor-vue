import fs from 'node:fs'
import { execSync } from 'node:child_process'
import prompts from 'prompts'
import spawn from 'cross-spawn'
import { loadFile, writeFile } from 'magicast'
import type { ASTNode, ProxifiedImportItem } from 'magicast'
import { cyan } from 'kolorist'

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

  const { shouldUpgradeDependencies } = await prompts({
    type: 'confirm',
    name: 'shouldUpgradeDependencies',
    message: 'Upgrade dependencies',
  })

  console.log(cyan('Fetching origin...'))
  spawn.sync('git', ['pull'], { stdio: 'inherit' })

  console.log(cyan(`Switching to Vue ${targetVersion}...`))

  const mod = await loadFile('./vite.config.ts')

  let isViteConfigChanged = false

  for (const k in mod.imports) {
    for (const vueVersion in vueVersionToVitePlugin) {
      if (mod.imports[k].from === vueVersionToVitePlugin[vueVersion as VueVersion] && targetVersion !== vueVersion) {
        delete mod.imports[k]
        isViteConfigChanged = true
        break
      }
    }
  }

  if (!mod.imports.vue) {
    mod.imports.vue = {
      imported: targetVersion === '2.6' ? 'createVuePlugin' : 'default',
      local: 'vue',
      from: vueVersionToVitePlugin[targetVersion],
    } as ProxifiedImportItem
    isViteConfigChanged = true
  }

  if (isViteConfigChanged) {
    await writeFile(mod as unknown as ASTNode, './vite.config.ts')
    spawn.sync('npx', ['eslint', './vite.config.ts', '--fix'], { stdio: 'inherit' })
  }

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
    spawn.sync('npx', ['eslint', './package.json', '--fix'], { stdio: 'inherit' })
    if (!shouldUpgradeDependencies) {
      installDependencies()
    }
  }

  if (shouldUpgradeDependencies) {
    installDependencies()
  }

  spawn.sync('npx', ['vite', '--open'], { stdio: 'inherit' })

  function installDependencies() {
    console.log(cyan('Checking pnpm version...'))
    const latestPNPMVersion = spawn.sync('npm', ['view', 'pnpm', 'version']).stdout.toString().trim()
    const currentPNPMVersion = spawn.sync('pnpm', ['-v']).stdout.toString().trim()
    if (latestPNPMVersion === currentPNPMVersion) {
      return
    }
    console.log(cyan('Upgrading pnpm...'))
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
    spawn.sync('pnpm', ['add', 'cnpm', '@antfu/ni', 'only-allow', '-g'], { stdio: 'inherit' })
    console.log(cyan('Upgrading dependencies...'))
    spawn.sync('pnpm', ['up'], { stdio: 'inherit' })
    spawn.sync('npx', ['vue-demi-switch', targetVersion === '2.6' ? '2' : targetVersion], { stdio: 'inherit' })
  }
}

try {
  dev()
} catch (e) {
  console.error(e)
}
