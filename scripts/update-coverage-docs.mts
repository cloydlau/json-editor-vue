import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import spawn from 'cross-spawn'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const summaryPath = path.join(root, 'coverage/coverage-summary.json')

const START = '<!-- coverage-table:start -->'
const END = '<!-- coverage-table:end -->'

interface CoverageMetric {
  total: number
  covered: number
  skipped: number
  pct: number | string
}

interface FileCoverage {
  lines: CoverageMetric
  statements: CoverageMetric
  functions: CoverageMetric
  branches: CoverageMetric
}

type CoverageSummary = Record<string, FileCoverage> & {
  total: FileCoverage
}

const docs = [
  {
    file: path.join(root, 'README.md'),
    heading: '## Test Coverage',
    before: '## Install',
  },
  {
    file: path.join(root, 'docs/README.zh-CN.md'),
    heading: '## 测试覆盖率',
    before: '## 安装',
  },
] as const

// 将覆盖率百分比格式化为表格单元格文案。
function formatPct(pct: number | string): string {
  if (typeof pct !== 'number' || Number.isNaN(pct)) {
    return '-'
  }
  return Number.isInteger(pct) ? String(pct) : pct.toFixed(2).replace(/\.?0+$/, '')
}

// 按覆盖率选择 shields.io badge 颜色。
function badgeColor(pct: number): string {
  if (pct >= 100) {
    return 'brightgreen'
  }
  if (pct >= 90) {
    return 'green'
  }
  if (pct >= 80) {
    return 'yellow'
  }
  if (pct >= 70) {
    return 'orange'
  }
  return 'red'
}

// 把绝对路径转为相对 `src/` 的文件名，便于写入文档表格。
function relativeFile(absPath: string): string {
  return path.relative(path.join(root, 'src'), absPath).replaceAll('\\', '/')
}

/**
 * 根据 coverage-summary.json 生成 Markdown 覆盖率表格。
 * @param summary Vitest/istanbul 的 coverage-summary
 */
function buildMarkdownTable(summary: CoverageSummary): string {
  const rows: Array<[string, string, string, string, string]> = [
    [
      'All files',
      formatPct(summary.total.statements.pct),
      formatPct(summary.total.branches.pct),
      formatPct(summary.total.functions.pct),
      formatPct(summary.total.lines.pct),
    ],
  ]

  for (const [filePath, metrics] of Object.entries(summary)) {
    if (filePath === 'total') {
      continue
    }
    rows.push([
      relativeFile(filePath),
      formatPct(metrics.statements.pct),
      formatPct(metrics.branches.pct),
      formatPct(metrics.functions.pct),
      formatPct(metrics.lines.pct),
    ])
  }

  const header = '| File | % Stmts | % Branch | % Funcs | % Lines |'
  const sep = '| --- | ---: | ---: | ---: | ---: |'
  const body = rows.map(([file, stmts, branch, funcs, lines]) =>
    `| ${file} | ${stmts} | ${branch} | ${funcs} | ${lines} |`).join('\n')

  // 表格上下留空行，方便 eslint markdown 格式化
  return `\n${header}\n${sep}\n${body}\n`
}

/**
 * 更新文档中的 coverage badge 百分比与颜色。
 * @param content 文档原文
 * @param linesPct 行覆盖率
 */
function updateBadge(content: string, linesPct: number): string {
  const pct = Math.round(linesPct)
  const color = badgeColor(linesPct)
  return content.replace(
    /img\.shields\.io\/badge\/coverage-\d+(?:\.\d+)?%25-[a-z]+/g,
    `img.shields.io/badge/coverage-${pct}%25-${color}`,
  )
}

/**
 * 在指定章节前插入或更新覆盖率表格；若章节已存在于其他位置则先移除再写入。
 * @param content 文档原文
 * @param heading 覆盖率章节标题
 * @param before 插入位置（紧挨该标题之前）
 * @param table Markdown 表格
 */
function upsertCoverageSection(content: string, heading: string, before: string, table: string): string {
  const block = `${START}\n${table}\n${END}`
  // 只带前置 <br>；后置 <br> 属于下一章节，不在这里增删
  const section = `<br>\n\n${heading}\n\n${block}\n`
  const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

  // 只移除覆盖率章节及其前置 <br>
  content = content.replace(
    new RegExp(`(?:\\n<br>\\n)?\\n*${escapedHeading}\\n+${START}[\\s\\S]*?${END}\\n*`),
    '\n',
  )

  const beforeWithBr = `\n<br>\n\n${before}`
  if (content.includes(beforeWithBr)) {
    return content.replace(beforeWithBr, `\n${section}${beforeWithBr}`)
  }
  if (content.includes(before)) {
    return content.replace(before, `${section}\n<br>\n\n${before}`)
  }

  return `${content.trimEnd()}\n\n${section}\n`
}

// 执行单元测试并生成覆盖率报告；失败则退出进程。
function runCoverage() {
  const result = spawn.sync('pnpm', ['exec', 'vitest', 'run', '--coverage'], {
    cwd: root,
    stdio: 'inherit',
  })
  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

// 读取 Vitest 输出的 coverage-summary.json。
function readSummary(): CoverageSummary {
  if (!fs.existsSync(summaryPath)) {
    console.error(`Missing ${summaryPath}. Run coverage first.`)
    process.exit(1)
  }
  return JSON.parse(fs.readFileSync(summaryPath, 'utf8')) as CoverageSummary
}

// 对已更新的文档执行与 lint-staged 一致的自动修复。
function lintDocs() {
  const files = docs.map(doc => path.relative(root, doc.file))
  const commands: Array<[string, string[]]> = [
    ['pnpm', ['exec', 'case-police', '--fix', ...files]],
    ['pnpm', ['exec', 'zhlint', '--fix', ...files]],
    ['pnpm', ['exec', 'eslint', '--cache', '--fix', ...files]],
  ]
  for (const [command, args] of commands) {
    const result = spawn.sync(command, args, {
      cwd: root,
      stdio: 'inherit',
    })
    if (result.status !== 0)
      process.exit(result.status ?? 1)
  }
}

// 跑覆盖率、同步中英文 README 中的表格与 badge，并 stage 文档改动供本次 commit 纳入。
function main() {
  runCoverage()

  const summary = readSummary()
  const table = buildMarkdownTable(summary)
  const linesPct = typeof summary.total.lines.pct === 'number' ? summary.total.lines.pct : 0

  for (const doc of docs) {
    let content = fs.readFileSync(doc.file, 'utf8')
    content = updateBadge(content, linesPct)
    content = upsertCoverageSection(content, doc.heading, doc.before, table)
    fs.writeFileSync(doc.file, content)
    console.info(`Updated coverage table in ${path.relative(root, doc.file)}`)
  }

  lintDocs()

  const staged = spawn.sync('git', ['add', 'README.md', 'docs/README.zh-CN.md'], {
    cwd: root,
    stdio: 'inherit',
  })
  if (staged.status !== 0) {
    process.exit(staged.status ?? 1)
  }
}

main()
