import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import demo from '../data/demo.json'
import { stepKinds, stepNames, tagTxt } from '../data/content'
import type { DemoCase } from '../lib/types'
import Reveal from './Reveal'

const cases = demo as DemoCase[]
const FINAL = stepNames.length + 1 // all steps shown + outcome

export default function Demo() {
  const [cur, setCur] = useState(0)
  const [shown, setShown] = useState(FINAL) // finished state first: what the server HTML and no-JS visitors see
  const timers = useRef<number[]>([])
  const box = useRef<HTMLDivElement>(null)
  const inView = useInView(box, { once: true, margin: '0px 0px -20% 0px' })

  const run = (i: number) => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setCur(i)
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(FINAL)
      return
    }
    setShown(0)
    for (let j = 1; j <= FINAL; j++) timers.current.push(window.setTimeout(() => setShown(j), 420 * j))
  }

  useEffect(() => {
    if (inView) run(0)
    return () => timers.current.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  const c = cases[cur]
  const done = shown >= FINAL
  const cls = { p: 'pass', f: 'fail', s: 'skip' } as const
  return (
    <section className="chapter" id="demo">
      <div className="wrap">
        <Reveal>
          <div className="chap-head">
            <div className="eyebrow">04 · Try it</div>
            <div>
              <h2>Pick an invoice. Watch it get decided.</h2>
              <p className="lede">Seven real invoices from the blind tests, run through the same checks the agent uses, step by step, ending with the decision and the reason a reviewer would see.</p>
            </div>
          </div>
        </Reveal>
        <div className="demo" ref={box}>
          <div className="picker" id="picker">
            {cases.map((x, i) => (
              <button key={x.id} type="button" className="pick" data-i={i} data-case={x.id} aria-pressed={i === cur} onClick={() => run(i)}>
                <b>{x.title}</b>
                <span>{x.sub}</span>
              </button>
            ))}
          </div>
          <div className="stage">
            <div>
              <div className="doc" id="dDoc">
                <div className="doc-head">
                  <div>
                    <b>{c.vendor}</b>
                    <div className="muted small mono">INV {c.invoice} · {c.po}</div>
                  </div>
                  <div className="mono small muted">{c.id === 'stmt' ? 'ACCOUNT STATEMENT' : c.id === 'scan' ? 'SCAN' : 'INVOICE'}</div>
                </div>
                <img
                  src={`${import.meta.env.BASE_URL}${c.image}`}
                  width={c.imageW}
                  height={c.imageH}
                  alt={`Real test invoice from ${c.vendor}${c.invoice && c.invoice !== 'not readable' ? `, number ${c.invoice}` : ''}`}
                  loading="lazy"
                  decoding="async"
                  style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid var(--line)', borderRadius: 3 }}
                />
              </div>
              <button className="btn primary run" id="runBtn" type="button" onClick={() => run(cur)}>Run again</button>
            </div>
            <div>
              <ol className="steps" id="dSteps">
                {stepNames.map((s, j) => {
                  const on = shown > j
                  const st = c.steps[j]
                  return (
                    <li key={s} className={on ? `step on ${cls[st.s]}` : 'step'} data-state={on ? cls[st.s] : 'pending'}>
                      <i>{on ? (st.s === 'p' ? '✓' : st.s === 'f' ? '!' : '') : ''}</i>
                      <div><b>{s}</b><p>{st.t || 'Not reached'}</p></div>
                      <span className={'tag ' + stepKinds[j]}>{tagTxt[stepKinds[j]]}</span>
                    </li>
                  )
                })}
              </ol>
              <div className={'outcome' + (done ? ' ' + c.outcome.kind : '')} id="dOut" aria-live="polite" data-outcome={done ? c.outcome.kind : 'running'}>
                {done ? (
                  <>
                    <b>{c.outcome.title}</b>
                    {c.outcome.text}
                  </>
                ) : (
                  <span className="muted">Running checks…</span>
                )}
              </div>
              <p className="note">Real invoice from the blind tests (synthetic company data). The steps show what the system computed and decided.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
