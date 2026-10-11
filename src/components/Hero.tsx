import { useEffect, useRef, useState } from 'react'
import demo from '../data/demo.json'
import { heroChecks, heroStats } from '../data/content'
import type { DemoCase } from '../lib/types'

const cases = (demo as DemoCase[]).filter((c) => c.hero)
const sleep = (fn: () => void, ms: number) => window.setTimeout(fn, ms)

export default function Hero() {
  const [idx, setIdx] = useState(0)
  // checks: 0 pending, 1 ok, 2 bad; the first render is the finished state of case 0 (also what shows without JS)
  const [checks, setChecks] = useState<number[]>(() => cases[0].hero!.checks.map((c) => (c ? 1 : 2)))
  const [stamp, setStamp] = useState(true)
  const timers = useRef<number[]>([])
  const c = cases[idx % cases.length]

  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const clear = () => {
      timers.current.forEach(clearTimeout)
      timers.current = []
    }
    const play = (i: number) => {
      const k = cases[i % cases.length]
      setIdx(i % cases.length)
      setChecks(k.hero!.checks.map(() => 0))
      setStamp(false)
      k.hero!.checks.forEach((r, j) => timers.current.push(sleep(() => setChecks((p) => p.map((v, n) => (n === j ? (r ? 1 : 2) : v))), 500 + j * 450)))
      const n = k.hero!.checks.length
      timers.current.push(sleep(() => setStamp(true), 700 + n * 450))
      timers.current.push(sleep(() => play(i + 1), 3600 + n * 450))
    }
    // the poster (case 0, finished) stays for a few seconds, then the cycle continues with case 1
    timers.current.push(sleep(() => play(1), 3200))
    return clear
  }, [])

  const pay = c.outcome.kind === 'pay'
  return (
    <header className="hero">
      <div className="wrap">
        <div className="hero-grid">
          <div>
            <div className="eyebrow">Case study · Accounts payable automation</div>
            <h1>
              An AP agent that knows <em>when not to pay.</em>
            </h1>
            <p className="lede">
              Invoices arrive by email. AI reads them, code checks them against the purchase order, the goods receipt and the vendor master, and each one is either booked in QuickBooks or sent to a person with the reason attached.
            </p>
            <div className="hero-cta">
              <a className="btn primary" href="#demo">Run an invoice through it</a>
              <a className="btn" href="#results">See the test results</a>
            </div>
          </div>
          <div className="doc" aria-label="Animated sample invoice">
            <div className="doc-head">
              <div>
                <b id="hVendor">{c.vendor}</b>
                <div className="muted small mono" id="hMeta">INV {c.invoice} · {c.po}</div>
              </div>
              <div className="mono small muted">TAX INVOICE</div>
            </div>
            <table>
              <tbody id="hLines">
                {c.hero!.lines.map((l) => (
                  <tr key={l.d}>
                    <td>{l.d}</td>
                    <td>{l.a}</td>
                  </tr>
                ))}
                {c.hero!.more > 0 && (
                  <tr>
                    <td className="muted">+ {c.hero!.more} more lines</td>
                    <td></td>
                  </tr>
                )}
                <tr className="tot">
                  <td>Total USD</td>
                  <td id="hTotal">{c.total}</td>
                </tr>
              </tbody>
            </table>
            <ul className="checks" id="hChecks">
              {heroChecks.map((t, i) => (
                <li key={t} className={checks[i] === 1 ? 'ok' : checks[i] === 2 ? 'bad' : ''}>{t}</li>
              ))}
            </ul>
            <div className={'stamp ' + (pay ? 'pay' : 'hold') + (stamp ? ' show' : '')} id="hStamp">
              {pay ? 'PAID' : 'TO REVIEW'}
            </div>
          </div>
        </div>

        <div className="stats">
          {heroStats.map((s) => (
            <div className="stat" key={s.n}>
              <b className="num">{s.n}</b>
              <span>{s.l}</span>
            </div>
          ))}
        </div>
      </div>
    </header>
  )
}
