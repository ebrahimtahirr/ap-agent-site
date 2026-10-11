import { test, expect, type Page } from '@playwright/test'

const SECTIONS = ['problem', 'policy', 'solution', 'demo', 'build', 'results', 'broke', 'limits', 'about']

async function scrollThrough(page: Page) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y < h; y += 500) {
    await page.evaluate((v) => window.scrollTo(0, v), y)
    await page.waitForTimeout(40)
  }
  await page.evaluate(() => window.scrollTo(0, 0))
}

test.describe('without JavaScript', () => {
  test.use({ javaScriptEnabled: false })
  test('every section and its key content is in the HTML and visible', async ({ page }) => {
    await page.goto('./')
    for (const id of SECTIONS) await expect(page.locator(`#${id}`)).toBeVisible()
    await expect(page.locator('h1')).toContainText('knows when not to pay')
    await expect(page.locator('#dOut')).toContainText('Paid automatically')
    await expect(page.locator('#dSteps li')).toHaveCount(7)
    await expect(page.locator('#pipe .node')).toHaveCount(8)
    await expect(page.locator('.res tbody tr')).toHaveCount(7)
    // visible means opacity 1 too: nothing is hidden waiting for JS
    const hidden = await page.evaluate(
      () => [...document.querySelectorAll('section, .wrap > div')].filter((e) => getComputedStyle(e).opacity === '0').length,
    )
    expect(hidden).toBe(0)
  })
})

test('every section renders, with the mockup copy and no Concept banner', async ({ page }) => {
  await page.goto('./')
  await scrollThrough(page)
  for (const id of SECTIONS) await expect(page.locator(`#${id}`)).toBeVisible()
  for (const t of [
    'Reading invoices is solved',
    'First, write the policy down.',
    'Code for facts. AI for judgment.',
    'Pick an invoice. Watch it get decided.',
    'Built like an AP system, tested like a model.',
    'What broke, and what I did about it.',
    "What it doesn't do yet.",
  ])
    await expect(page.getByRole('heading', { name: t })).toBeVisible()
  await expect(page.getByText('Concept mockup')).toHaveCount(0)
  await expect(page.locator('.stat')).toHaveCount(4)
  await expect(page.locator('.stat').first()).toContainText('392 blind invoices')
  await expect(page.locator('.bench > div')).toHaveCount(4)
  await expect(page.locator('#touchChart rect')).toHaveCount(4)
  await expect(page.locator('#about h2')).toContainText('Ebrahim Tahir Awan')
  await expect(page.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute(
    'href',
    'https://www.linkedin.com/in/m-ebrahim-tahir-awan-660029231/',
  )
})

test('tolerance calculator math', async ({ page }) => {
  await page.goto('./#policy')
  const po = page.locator('#poAmt'),
    inv = page.locator('#invAmt')
  const set = async (a: string, b: string) => {
    await po.fill(a)
    await inv.fill(b)
  }
  await expect(page.locator('#cVerdict')).toHaveClass(/hold/) // defaults 12500 / 12580
  await expect(page.locator('#cDiff')).toHaveText('$80.00 (0.64%)')
  await expect(page.locator('#cLim')).toHaveText('$50.00')
  await set('12500', '12550')
  await expect(page.locator('#cVerdict')).toHaveClass(/pay/) // exactly at the cap
  await set('12500', '12550.01')
  await expect(page.locator('#cVerdict')).toHaveClass(/hold/)
  await set('1000', '1010')
  await expect(page.locator('#cAllow')).toHaveText('$10.00')
  await expect(page.locator('#cVerdict')).toHaveClass(/pay/)
  await set('1000000', '1000400')
  await expect(page.locator('#cLim')).toHaveText('$500.00')
  await expect(page.locator('#cVerdict')).toHaveClass(/pay/)
  await set('80000', '80080')
  await expect(page.locator('#cLim')).toHaveText('$80.00')
  await expect(page.locator('#cVerdict')).toHaveClass(/pay/)
  await set('0', '10')
  await expect(page.locator('#cVerdict')).toHaveClass(/hold/)
  await expect(page.locator('#cDiff')).toHaveText('$10.00')
})

test('pipeline: each of the 8 steps opens its own detail', async ({ page }) => {
  await page.goto('./#solution')
  const nodes = page.locator('#pipe .node')
  await expect(nodes).toHaveCount(8)
  const titles = ['Gmail inbox', 'Read the document', 'Vendor master', 'PO and receipt', 'Amount and quantity', 'Earlier twin?', 'Explain the case', 'Bill or escalate']
  for (let i = 0; i < 8; i++) {
    await nodes.nth(i).click()
    await expect(nodes.nth(i)).toHaveAttribute('aria-pressed', 'true')
    await expect(page.locator('#pipeDetail h3')).toHaveText(titles[i])
    await expect(page.locator('#pipe .node[aria-pressed="true"]')).toHaveCount(1)
  }
})

const EXPECT: Record<string, { kind: 'pay' | 'hold'; title: string; steps: string }> = {
  clean: { kind: 'pay', title: 'Paid automatically', steps: 'ppppppp' },
  tol: { kind: 'hold', title: 'Sent to a person', steps: 'ppppfpp' },
  dup: { kind: 'hold', title: 'Held as a duplicate', steps: 'pppppp' + 'f' },
  vendor: { kind: 'hold', title: 'Sent to a person', steps: 'ppfssss' },
  partial: { kind: 'pay', title: 'Paid automatically', steps: 'ppppppp' },
  scan: { kind: 'hold', title: 'Sent to a person', steps: 'pfsssss' },
  stmt: { kind: 'hold', title: 'Sent to a person', steps: 'pfsssss' },
}
test('every demo case reaches the right outcome', async ({ page }) => {
  await page.goto('./#demo')
  for (const [id, e] of Object.entries(EXPECT)) {
    await page.locator(`.pick[data-case="${id}"]`).click()
    await expect(page.locator(`.pick[data-case="${id}"]`)).toHaveAttribute('aria-pressed', 'true')
    await expect(page.locator('#dOut')).toHaveAttribute('data-outcome', e.kind, { timeout: 8000 })
    await expect(page.locator('#dOut b')).toHaveText(e.title)
    const states = await page.locator('#dSteps li').evaluateAll((els) => els.map((x) => (x as HTMLElement).dataset.state))
    const map: Record<string, string> = { pass: 'p', fail: 'f', skip: 's' }
    expect(states.map((s) => map[s as string]).join('')).toBe(e.steps)
    const ok = await page.locator('#dDoc img').evaluate((im) => (im as HTMLImageElement).complete && (im as HTMLImageElement).naturalWidth > 0)
    expect(ok).toBe(true)
  }
})

test('demo: Run again replays the steps', async ({ page }) => {
  await page.goto('./#demo')
  await page.locator('.pick[data-case="tol"]').click()
  await expect(page.locator('#dOut')).toHaveAttribute('data-outcome', 'hold', { timeout: 8000 })
  await page.locator('#runBtn').click()
  await expect(page.locator('#dOut')).toHaveAttribute('data-outcome', 'running')
  await expect(page.locator('#dOut')).toHaveAttribute('data-outcome', 'hold', { timeout: 8000 })
})

test('hero cycles through three real invoices and stamps each correctly', async ({ page }) => {
  await page.goto('./')
  const results: Record<string, string> = {}
  const t0 = Date.now()
  while (Date.now() - t0 < 40_000 && Object.keys(results).length < 3) {
    const v = ((await page.locator('#hVendor').textContent()) || '').trim()
    if (await page.locator('#hStamp.show').count()) results[v] = ((await page.locator('#hStamp').textContent()) || '').trim()
    await page.waitForTimeout(250)
  }
  expect(results).toEqual({
    'Composite Materials Corp': 'PAID',
    'Enviro Clean Products': 'TO REVIEW',
    'Global Bearing Corporation': 'TO REVIEW',
  })
})

test('light and dark themes switch tokens and the chart follows', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await page.goto('./')
  const paper = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor)
  expect(await paper()).toBe('rgb(244, 246, 244)')
  await page.locator('#themeBtn').click()
  expect(await page.evaluate(() => document.documentElement.dataset.theme)).toBe('dark')
  expect(await paper()).toBe('rgb(14, 22, 20)')
  await expect(page.locator('#themeBtn')).toHaveText('Light mode')
  const bar = await page.locator('#touchChart rect').last().evaluate((r) => getComputedStyle(r).fill)
  expect(bar).toBe('rgb(72, 194, 160)') // dark accent
  await page.locator('#themeBtn').click()
  expect(await paper()).toBe('rgb(244, 246, 244)')
})

test('follows the OS dark preference', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('./')
  expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe('rgb(14, 22, 20)')
  await expect(page.locator('#themeBtn')).toHaveText('Light mode')
})

test.describe('390px mobile', () => {
  test.use({ viewport: { width: 390, height: 844 } })
  test('no horizontal scroll anywhere, in light and dark', async ({ page }) => {
    for (const scheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme: scheme })
      await page.goto('./')
      const h = await page.evaluate(() => document.documentElement.scrollHeight)
      for (let y = 0; y <= h; y += 400) {
        await page.evaluate((v) => window.scrollTo(0, v), y)
        const w = await page.evaluate(() => ({
          s: document.documentElement.scrollWidth,
          c: document.documentElement.clientWidth,
          b: document.body.scrollWidth,
        }))
        expect(w.s, `scrollWidth at y=${y} (${scheme})`).toBeLessThanOrEqual(w.c)
        expect(w.b).toBeLessThanOrEqual(w.c)
      }
      await page.locator('.pick[data-case="dup"]').click()
      await expect(page.locator('#dOut')).toHaveAttribute('data-outcome', 'hold', { timeout: 8000 })
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390)
    }
  })
})

test.describe('reduced motion', () => {
  test('final states appear immediately', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('./#demo')
    await page.locator('.pick[data-case="scan"]').click()
    await expect(page.locator('#dOut')).toHaveAttribute('data-outcome', 'hold', { timeout: 1500 })
    await expect(page.locator('#hStamp')).toHaveClass(/show/)
  })
})

test('what broke: every card shows its status chip in the normal flow, plus the bank-detail note', async ({ page }) => {
  await page.goto('./#broke')
  const chips = page.locator('#broke .status')
  await expect(chips).toHaveCount(4)
  for (let i = 0; i < 4; i++) {
    await expect(chips.nth(i)).toBeVisible()
    expect(await chips.nth(i).evaluate((e) => getComputedStyle(e).position)).toBe('static')
  }
  await expect(page.locator('#broke')).toContainText('3 invoices with changed bank details were paid')
})

test('numbers match the results files', async ({ page }) => {
  await page.goto('./')
  const t = await page.locator('main, header').allInnerTexts()
  const all = t.join(' ')
  for (const n of ['392', '65.2%', '80.4%', '33.7%', '51.0%', '300', '92', '69', '81', '18', '$0.010', '197', '265 aliases', '534']) expect(all).toContain(n)
  // numbers corrected against FINAL_RESULTS.md / heldout results (see PROGRESS.md)
  expect(all).not.toContain('v1.0 ')
  expect(all).not.toContain('Zero wrong payments')
})
