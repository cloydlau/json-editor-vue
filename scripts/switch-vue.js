import parseArgs from 'https://deno.land/x/deno_minimist@v1.0.2/mod.ts'
import Prompt from 'https://deno.land/x/prompt@v1.0.0/mod.ts'

const deps = {
  3: {
    '@vitejs/plugin-vue': 'latest',
    '@vue/compiler-sfc': 'latest',
    '@vue/test-utils': 'latest',
    'element-plus': 'latest',
    'vue': 'latest',
  },
  2.7: {
    '@vitejs/plugin-vue2': 'latest',
    '@vue/test-utils': '1',
    'element-ui': 'latest',
    'vue': '^2.7',
  },
  2: {
    '@vue/composition-api': 'latest',
    '@vue/test-utils': '1',
    'element-ui': 'latest',
    'vite-plugin-vue2': 'latest',
    'vue': '~2.6',
    'vue-template-compiler': '~2.6',
  },
}
const args = parseArgs(Deno.args)
const pkg = JSON.parse(Deno.readTextFileSync('./package.json'))

const run = async (opt) => {
  if (opt.cmd)
    opt.cmd = ['cmd', '/c', ...opt.cmd.split(' ')]

  const p = Deno.run(opt)
  const { code } = await p.status() // (*1); wait here for child to finish
  p.close()
  if (opt.stdout === 'piped')
    return new TextDecoder().decode(await p.output()).trim()
}

const targetVersion = args._[0]
let currentVersion = 3
if ((
  pkg.devDependencies.vue === '2'
  || pkg.devDependencies.vue.startsWith('2.7')
  || pkg.devDependencies.vue.startsWith('~2.7')
  || pkg.devDependencies.vue.startsWith('^2.7')))
  currentVersion = 2.7

else if ((
  pkg.devDependencies.vue.startsWith('2.')
  || pkg.devDependencies.vue.startsWith('~2.')
  || pkg.devDependencies.vue.startsWith('^2.')))
  currentVersion = 2

async function main() {
  if (currentVersion !== targetVersion) {
    const { yes } = await Prompt.prompts([{
      type: 'confirm',
      name: 'yes',
      message: `当前 Vue 版本为 ${currentVersion}, 是否切换至 ${targetVersion}？`,
    }])
    if (!yes)
      return
  }

  for (const k in deps) {
    if (k !== targetVersion) {
      for (const k2 in deps[k])
        delete pkg.devDependencies[k2]
    }
  }

  for (const k in deps[targetVersion])
    pkg.devDependencies[k] = deps[targetVersion][k]

  Deno.writeTextFileSync('./package.json', JSON.stringify(pkg, null, 2))

  await run({ cmd: 'pnpm i' })
  await run({ cmd: `npx vue-demi-switch ${targetVersion}` })
}

main().catch((e) => {
  console.error(e)
})
