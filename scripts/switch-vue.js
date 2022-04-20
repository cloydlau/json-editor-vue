/*const fs = require('fs')
const path = require('path')

const Vue2 = path.join(__dirname, '../node_modules/vue2')
const DefaultVue = path.join(__dirname, '../node_modules/vue')
const Vue3 = path.join(__dirname, '../node_modules/vue3')*/

const execa = require('execa')
const run = (bin, args, opts = {}) =>
  execa(bin, args, { stdio: 'inherit', ...opts })
const { dependencies, devDependencies } = require('../package.json')

const vue3Deps = [
  '@vitejs/plugin-vue',
  '@vue/compiler-sfc',
  'element-plus',
], vue2Deps = [
  '@vue/composition-api',
  'element-ui',
  'vite-plugin-vue2',
  'vue-template-compiler',
]

const targetVersion = Number(process.argv[2]) || 3
const currentVersion = require('vue').version

useVueVersion(targetVersion)

async function removeDeps (deps) {
  const depsInstalled = deps.filter(dep => dep in devDependencies || dep in dependencies)
  await run('pnpm', ['remove', ...depsInstalled, '-D'])
}

async function useVueVersion (targetVersion) {
  if (
    (currentVersion.startsWith('2.') || currentVersion.substring(1).startsWith('2.')) &&
    targetVersion === 3
  ) {
    await removeDeps(vue2Deps)
    await run('pnpm', ['add', ...vue3Deps, '-D'])
    await run('pnpm', ['add', 'vue@latest', '@vue/test-utils@latest', '-D'])
    await run('npx', ['vue-demi-switch', '3'])
    console.warn('Vue 版本已切换至 3')
  } else if (
    (currentVersion === 'latest' || currentVersion.startsWith('3.') || currentVersion.substring(1).startsWith('3.')) &&
    targetVersion === 2
  ) {
    await removeDeps(vue3Deps)
    await run('pnpm', ['add', ...vue2Deps, '-D'])
    await run('pnpm', ['add', 'vue@2', '@vue/test-utils@1', '-D'])
    await run('npx', ['vue-demi-switch', '2'])
    console.warn('Vue 版本已切换至 2')
  } else {
    console.warn('Vue 版本未切换')
  }
  /*if (!fs.existsSync(DefaultVue)) {
    console.log('There is no default Vue version, finding it')
    if (targetVersion === 2 && fs.existsSync(Vue3)) {
      rename(Vue3, DefaultVue)
      console.log('Renamed "vue3" to "vue"')
    } else {
      rename(Vue2, DefaultVue)
      console.log('Renamed "vue2" to "vue"')
    }
  }

  if (targetVersion === 3 && fs.existsSync(Vue3)) {
    rename(DefaultVue, Vue2)
    rename(Vue3, DefaultVue)
  } else if (targetVersion === 2 && fs.existsSync(Vue2)) {
    rename(DefaultVue, Vue3)
    rename(Vue2, DefaultVue)
  } else {
    console.log(`Vue ${targetVersion} is already in use`)
  }*/
}

/*function rename (fromPath, toPath) {
  if (!fs.existsSync(fromPath)) return
  fs.rename(fromPath, toPath, function (err) {
    if (err) {
      console.log(err)
    } else {
      console.log(`Successfully renamed ${fromPath} to ${toPath}.`)
    }
  })
}*/
