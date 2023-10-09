const fs = require('node:fs')

function devPreinstall() {
  // 安装依赖前，将 devDependencies 的版本号替换为 latest
  // 只会替换 ^* 和 *，如果需要指定某些依赖的版本，可以使用波浪号，或直接锁死
  // 一方面是保持 git diff 的干净清爽，另一方面是保持依赖不过时
  // 版本号的变更记录用 lock 文件来追踪
  const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
  const { devDependencies } = pkg

  let isConverted = false
  for (const k in devDependencies) {
    if (devDependencies[k].startsWith('^') || devDependencies[k] === '*') {
      devDependencies[k] = 'latest'
      isConverted = true
    }
  }

  if (isConverted) {
    fs.writeFileSync('./package.json', JSON.stringify(pkg, null, 2))
  }
}

try {
  devPreinstall()
} catch (e) {
  console.error(e)
}
