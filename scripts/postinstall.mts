import process from 'node:process'
import spawn from 'cross-spawn'

// simple-git-hooks might not be installed when installing json-editor-vue as a dependency
if (process.env.INIT_CWD === process.cwd()) {
  spawn.sync('npx', ['simple-git-hooks'], { stdio: 'inherit' })
}
