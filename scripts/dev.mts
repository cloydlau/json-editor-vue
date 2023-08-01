import fs from 'node:fs'
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
      spawn.sync('pnpm', ['i'], { stdio: 'inherit' })
      spawn.sync('npx', ['vue-demi-switch', targetVersion === '2.6' ? '2' : targetVersion], { stdio: 'inherit' })
    }
  }

  if (shouldUpgradeDependencies) {
    console.log(cyan('Upgrading dependencies...'))
    spawn.sync('pnpm', ['up'], { stdio: 'inherit' })
    spawn.sync('npx', ['vue-demi-switch', targetVersion === '2.6' ? '2' : targetVersion], { stdio: 'inherit' })
  }

  spawn.sync('npx', ['vite', '--open'], { stdio: 'inherit' })
}

try {
  dev()
} catch (e) {
  console.error(e)
}
