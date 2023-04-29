import fs from 'node:fs'
import prompts from 'prompts'
import spawn from 'cross-spawn'
import { loadFile, writeFile } from 'magicast'
import { cyan } from 'kolorist'
import vueDeps from './vueDeps.json' assert { type:'json' }

const vueVersion = ['3', '2.7', '2.6']

const vueVersionToVitePlugin = {
  3: '@vitejs/plugin-vue',
  2.7: '@vitejs/plugin-vue2',
  2.6: 'vite-plugin-vue2',
}

const { targetVersion } = await prompts({
  type: 'select',
  name: 'targetVersion',
  message: 'Select Vue version',
  choices: Array.from(vueVersion, value => ({ title: value, value })),
})

const { shouldUpgradeDependencies } = await prompts({
  type: 'confirm',
  name: 'shouldUpgradeDependencies',
  message: 'Upgrade dependencies',
})

console.log(cyan('Fetching origin...'))
await spawn.sync('git pull', undefined, { stdio: 'inherit' })

console.log(cyan(`Switching to Vue ${targetVersion}...`))

const mod = await loadFile('./vite.config.ts')

let isViteConfigChanged = false

for (const k in mod.imports) {
  for (const vueVersion in vueVersionToVitePlugin) {
    if (mod.imports[k].from === vueVersionToVitePlugin[vueVersion] && targetVersion !== vueVersion) {
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
  }
  isViteConfigChanged = true
}

if (isViteConfigChanged) {
  await writeFile(mod, './vite.config.ts')
  await spawn.sync('npx eslint ./vite.config.ts --fix', undefined, { stdio: 'inherit' })
}

let isDepsChanged = false

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))

for (const ver in vueDeps) {
  if (ver !== targetVersion) {
    for (const deps in vueDeps[ver]) {
      // 删除非目标版本的依赖
      // peerDependencies 中的依赖会被 pnpm 自动添加，不删除
      if (pkg.devDependencies[deps] && !vueDeps[targetVersion][deps] && !pkg.peerDependencies[deps]) {
        delete pkg.devDependencies[deps]
        isDepsChanged = true
      }
    }
  }
}

for (const targetDeps in vueDeps[targetVersion]) {
  // 添加目标版本的依赖
  if (pkg.devDependencies[targetDeps] !== vueDeps[targetVersion][targetDeps]) {
    pkg.devDependencies[targetDeps] = vueDeps[targetVersion][targetDeps]
    isDepsChanged = true
  }
}

if (isDepsChanged) {
  fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2))
  console.log(cyan('Linting package.json...'))
  await spawn.sync('npx eslint ./package.json --fix', undefined, { stdio: 'inherit' })
  if (!shouldUpgradeDependencies) {
    await spawn.sync('pnpm i', undefined, { stdio: 'inherit' })
    await spawn.sync(`npx vue-demi-switch ${targetVersion === '2.6' ? '2' : targetVersion}`, undefined, { stdio: 'inherit' })
  }
}

if (shouldUpgradeDependencies) {
  console.log(cyan('Upgrading dependencies...'))
  await spawn.sync('pnpm up', undefined, { stdio: 'inherit' })
  await spawn.sync(`npx vue-demi-switch ${targetVersion === '2.6' ? '2' : targetVersion}`, undefined, { stdio: 'inherit' })
}

await spawn.sync('npx vite --open', undefined, { stdio: 'inherit' })
