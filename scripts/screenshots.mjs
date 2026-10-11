// Screenshots of every section at desktop (1440) and mobile (390), light and dark.  usage: node scripts/screenshots.mjs [baseUrl]
import { chromium } from '@playwright/test'
import { mkdirSync } from 'node:fs'

const base = process.argv[2] || 'http://localhost:4173/ap-agent-site/'
const sections = [
  ['hero', 'header.hero'],
  ['problem', '#problem'],
  ['policy', '#policy'],
  ['solution', '#solution'],
  ['demo', '#demo'],
  ['build', '#build'],
  ['results', '#results'],
  ['broke', '#broke'],
  ['limits', '#limits'],
  ['about', '#about'],
]
const browser = await chromium.launch()
for (const [device, vp] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
  for (const scheme of ['light', 'dark']) {
    const dir = `screenshots/${device}-${scheme}`
    mkdirSync(dir, { recursive: true })
    const ctx = await browser.newContext({ viewport: vp, colorScheme: scheme, deviceScaleFactor: device === 'mobile' ? 2 : 1 })
    const page = await ctx.newPage()
    await page.goto(base)
    await page.waitForLoadState('networkidle')
    await page.evaluate(() => document.fonts.ready)
    for (const [name, sel] of sections) {
      const el = page.locator(sel).first()
      await el.scrollIntoViewIfNeeded()
      await page.waitForTimeout(name === 'demo' ? 4800 : 900) // scroll-in + demo steps
      await page.addStyleTag({ content: name === 'hero' ? ' ' : '.nav{visibility:hidden}' })
      await el.screenshot({ path: `${dir}/${name}.png` })
    }
    await ctx.close()
  }
}
await browser.close()
console.log('screenshots written to screenshots/')
