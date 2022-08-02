/**
 * 更新依赖
 */

const run = async (opt) => {
  if (opt.cmd) {
    opt.cmd = ['cmd', '/c', ...opt.cmd.split(' ')]
  }
  const p = Deno.run(opt)
  const { code } = await p.status() // (*1); wait here for child to finish
  p.close()
  if (opt.stdout === 'piped')
    return new TextDecoder().decode(await p.output()).trim()
}

async function main() {
  console.log('\nChecking pnpm version...')
  const currVersion = await run({ cmd: 'pnpm -v', stdout: 'piped' })
  const latestVersion = await run({ cmd: 'npm view pnpm version', stdout: 'piped' })

  if (currVersion.stdout !== latestVersion.stdout) {
    console.log(`\n%cFound new pnpm version ${latestVersion.stdout}, updating...`, 'color:red;font-weight:bold')
    await run({ cmd: 'npm add pnpm -g', })

    console.log('\nSetting pnpm registry...')
    await run({ cmd: 'pnpm config set registry https://registry.npmmirror.com' })
  }

  console.log('\nUpdating dependencies...')
  await run({ cmd: 'pnpm upgrade' })
}

main().catch(e => {
  console.error(e)
})
