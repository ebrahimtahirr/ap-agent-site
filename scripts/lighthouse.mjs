// Runs Lighthouse (mobile + desktop) against a URL and prints the scores.  usage: node scripts/lighthouse.mjs <url> <label>
import { execFileSync } from 'node:child_process'
import { readFileSync, mkdirSync } from 'node:fs'
import { chromium } from '@playwright/test'

const url = process.argv[2] || 'http://localhost:4173/ap-agent-site/'
const label = process.argv[3] || 'local'
mkdirSync('lighthouse', { recursive: true })
process.env.CHROME_PATH = chromium.executablePath()
const rows = []
for (const form of ['mobile', 'desktop']) {
  const out = `lighthouse/${label}-${form}`
  const args = ['--yes', 'lighthouse@12.2.1', url, '--output=json', '--output=html', `--output-path=${out}`, '--chrome-flags=--headless=new --no-sandbox', '--quiet']
  if (form === 'desktop') args.push('--preset=desktop')
  execFileSync(process.platform === 'win32' ? 'npx.cmd' : 'npx', args, { stdio: 'inherit', shell: process.platform === 'win32' })
  const r = JSON.parse(readFileSync(`${out}.report.json`, 'utf8'))
  const sc = Object.fromEntries(Object.entries(r.categories).map(([k, v]) => [k, Math.round(v.score * 100)]))
  const a = r.audits
  rows.push({ form, ...sc, FCP: a['first-contentful-paint'].displayValue, LCP: a['largest-contentful-paint'].displayValue, CLS: a['cumulative-layout-shift'].displayValue, TBT: a['total-blocking-time'].displayValue })
}
console.table(rows)
