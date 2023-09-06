import process from 'node:process'
import spawn from 'cross-spawn'

console.log(123, process.env.INIT_CWD)
console.log(456, process.cwd())

// simple-git-hooks might not be installed when installing json-editor-vue as a dependency
if (process.env.INIT_CWD !== process.cwd()) {
  process.exit()
}

spawn.sync('npx', ['simple-git-hooks'], { stdio: 'inherit' })
