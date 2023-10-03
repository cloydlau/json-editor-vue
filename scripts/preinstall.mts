import fs from 'node:fs'
import spawn from 'cross-spawn'

declare const process: NodeJS.Process

function convertVersion(dependencies) {
  let isConverted = false
  for (const k in dependencies) {
    if (dependencies[k].startsWith('^') || dependencies[k] === '*') {
      dependencies[k] = 'latest'
      isConverted = true
    }
  }
  return isConverted
}

async function preinstall() {
  // 仅限开发环境
  if (process.env.INIT_CWD === process.cwd()) {
    // 配置 git 钩子
    spawn.sync('npx', ['only-allow', 'pnpm'], { stdio: 'inherit' })

    // 安装依赖前，将依赖的版本号替换为 latest
    // 只会替换 ^* 和 *，如果需要指定某些依赖的版本，可以使用波浪号，或直接锁死
    // 一方面是保持 git diff 的干净清爽，另一方面是保持依赖不过时
    // 版本号的变更记录用 lock 文件来追踪
    const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
    const { dependencies, devDependencies } = pkg

    const isDependenciesConverted = convertVersion(dependencies)
    const isDevDependenciesConverted = convertVersion(devDependencies)

    if (isDependenciesConverted || isDevDependenciesConverted) {
      fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2))
    }
  }
}

try {
  preinstall()
} catch (e) {
  console.error(e)
}
