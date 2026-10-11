import { useEffect, useState, type ReactNode } from 'react'
import Reveal from './Reveal'
import {
  bench, brokeNote, broke, gate, limitsA, limitsB, links, nodes, resultsRows, rules, stack, tagTxt, timeline, touch,
} from '../data/content'
import { fmt, tolerance } from '../lib/tolerance'

function Chapter({ id, eyebrow, title, lede, children }: { id: string; eyebrow: string; title: string; lede?: string; children?: ReactNode }) {
  return (
    <section className="chapter" id={id}>
      <div className="wrap">
        <Reveal>
          <div className="chap-head">
            <div className="eyebrow">{eyebrow}</div>
            <div>
              <h2>{title}</h2>
              {lede && <p className="lede">{lede}</p>}
            </div>
          </div>
        </Reveal>
        {children}
      </div>
    </section>
  )
}

const fv = (u: string, v: number) => (u === '$' ? '$' + v.toFixed(2) : u === '%' ? v + '%' : v + u)

export function Problem() {
  return (
    <Chapter
      id="problem"
      eyebrow="01 · The problem"
      title="Reading invoices is solved. Deciding which ones to trust is not."
      lede="OCR has been around for decades, yet most AP teams still touch two out of three invoices by hand. The work sits in the exceptions: a price that drifted, a short shipment, a vendor name that doesn't match, a bill that arrives twice."
    >
      <Reveal>
        <div className="bench" id="bench">
          {bench.map((b) => (
            <div key={b.t}>
              <h3>{b.t}</h3>
              <div className="bar2">
                <div className="row">
                  <span className="muted">Average</span>
                  <div className="track"><div className="fill" style={{ width: `${(b.avg / b.max) * 100}%` }} /></div>
                  <span className="v">{fv(b.u, b.avg)}</span>
                </div>
                <div className="row best">
                  <span className="muted">Best</span>
                  <div className="track"><div className="fill" style={{ width: `${(b.best / b.max) * 100}%` }} /></div>
                  <span className="v">{fv(b.u, b.best)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="source">Source: Ardent Partners, State of ePayables 2025. Average AP team vs best-in-class.</p>
        <p className="callout">The opportunity: automate the clean majority safely, and give the AP team every exception with the reason already written.</p>
      </Reveal>
    </Chapter>
  )
}

export function Policy() {
  const [po, setPo] = useState('12500')
  const [inv, setInv] = useState('12580')
  const t = tolerance(parseFloat(po), parseFloat(inv))
  return (
    <Chapter
      id="policy"
      eyebrow="02 · Diagnosis"
      title="First, write the policy down."
      lede="Before building anything I wrote the AP policy as six testable rules. Every decision the agent makes, and every test score, traces back to this page."
    >
      <Reveal>
        <div className="policy">
          <ol className="rules">
            {rules.map(([n, h, p]) => (
              <li key={n}>
                <span>{n}</span>
                <div><b>{h}</b><p>{p}</p></div>
              </li>
            ))}
          </ol>
          <div className="calc">
            <div className="eyebrow">Try §3 · Amount tolerance</div>
            <div className="inputs">
              <div>
                <label htmlFor="poAmt">PO amount ($)</label>
                <input id="poAmt" type="number" min="0" step="0.01" value={po} onChange={(e) => setPo(e.target.value)} />
              </div>
              <div>
                <label htmlFor="invAmt">Invoice amount ($)</label>
                <input id="invAmt" type="number" min="0" step="0.01" value={inv} onChange={(e) => setInv(e.target.value)} />
              </div>
            </div>
            <dl>
              <dt>Difference</dt>
              <dd id="cDiff">{fmt(t.diff) + (t.diffPct !== null ? ` (${t.diffPct.toFixed(2)}%)` : '')}</dd>
              <dt>1% of PO</dt>
              <dd id="cPct">{fmt(t.pct)}</dd>
              <dt>Dollar limit: min($500, max($50, 0.1% of PO))</dt>
              <dd id="cLim">{fmt(t.limit)}</dd>
              <dt>Allowed difference</dt>
              <dd id="cAllow">{fmt(t.allow)}</dd>
            </dl>
            <div className={'verdict ' + (t.ok ? 'pay' : 'hold')} id="cVerdict">
              {t.ok ? 'Within tolerance. Pays automatically.' : 'Over tolerance. Sent to a person with the variance attached.'}
            </div>
          </div>
        </div>
      </Reveal>
    </Chapter>
  )
}

export function Solution() {
  const [sel, setSel] = useState(0)
  const n = nodes[sel]
  return (
    <Chapter
      id="solution"
      eyebrow="03 · Solution design"
      title="Code for facts. AI for judgment."
      lede="The model reads documents. It never does arithmetic and never decides whether money moves. Click a step to see what it does and why it is built that way."
    >
      <Reveal>
        <div className="pipe" id="pipe" role="group" aria-label="Pipeline steps">
          {nodes.map((x, i) => (
            <button key={x.s} type="button" className="node" data-i={i} aria-pressed={i === sel} onClick={() => setSel(i)}>
              <small>{String(i + 1).padStart(2, '0')} · {x.s}</small>
              <b>{x.n}</b>
              <span className={'tag ' + x.k}>{tagTxt[x.k]}</span>
            </button>
          ))}
        </div>
        <div className="legend">
          <span><span className="tag code">CODE</span> deterministic rule</span>
          <span><span className="tag ai">AI</span> Claude Haiku 4.5</span>
          <span><span className="tag ops">SYSTEM</span> integration</span>
        </div>
        <div className="pipe-detail" id="pipeDetail" aria-live="polite">
          <div>
            <span className={'tag ' + n.k}>{tagTxt[n.k]}</span>
            <h3 style={{ marginTop: 10 }}>{n.n}</h3>
            <p className="muted">{n.d}</p>
          </div>
          <div className="why">
            <div className="eyebrow">Why it's built this way</div>
            <p style={{ marginTop: 8 }}>{n.w}</p>
          </div>
        </div>
      </Reveal>
    </Chapter>
  )
}

export function Build() {
  return (
    <Chapter
      id="build"
      eyebrow="05 · The build"
      title="Built like an AP system, tested like a model."
      lede="Every change had to pass a regression gate before it went live. Nothing was tuned on the blind tests."
    >
      <Reveal>
        <div className="build">
          <div>
            <h3>Stack</h3>
            <div className="stack">{stack.map((s) => <span key={s}>{s}</span>)}</div>
            <div className="gate">
              <h3>The eval gate</h3>
              <p className="muted small" style={{ marginTop: 6 }}>197 labelled invoices. A change ships only if:</p>
              <ul>{gate.map((g) => <li key={g}>{g}</li>)}</ul>
            </div>
          </div>
          <ol className="timeline">
            {timeline.map(([v, b, p]) => (
              <li key={v}><span className="ver">{v}</span><b>{b}</b><p>{p}</p></li>
            ))}
          </ol>
        </div>
      </Reveal>
    </Chapter>
  )
}

function TouchChart() {
  // the colours are CSS variables, so the chart follows the theme without redrawing
  const x0 = 170, w = 330, max = 80, bh = 30, gap = 18, top = 10
  const bottom = top + touch.length * (bh + gap)
  return (
    <svg id="touchChart" viewBox="0 0 560 230" role="img"
      aria-label="Touchless rate: industry average 32.6%, blind test 1 33.7%, best-in-class 49.2%, blind test 2 65.2%">
      {[0, 20, 40, 60, 80].map((t) => {
        const x = x0 + (t / max) * w
        return (
          <g key={t}>
            <line x1={x} x2={x} y1={top - 4} y2={bottom - gap + 4} style={{ stroke: 'var(--line)' }} strokeWidth="1" />
            <text x={x} y={bottom + 12} textAnchor="middle" style={{ fill: 'var(--muted)' }}>{t}%</text>
          </g>
        )
      })}
      {touch.map((d, i) => {
        const y = top + i * (bh + gap)
        const bw = (d.v / max) * w
        return (
          <g key={d.l}>
            <text className="lbl" x={x0 - 12} y={y + bh / 2 + 4} textAnchor="end">{d.l}</text>
            <rect x={x0} y={y} width={bw} height={bh} rx="3" style={{ fill: d.a ? 'var(--accent)' : 'var(--muted)' }} fillOpacity={d.a ? 1 : 0.45} />
            <text className="val" x={x0 + bw + 8} y={y + bh / 2 + 4}>{d.v}%</text>
          </g>
        )
      })}
    </svg>
  )
}

export function Results() {
  return (
    <Chapter
      id="results"
      eyebrow="06 · Results"
      title="Twice as many invoices paid untouched. Still none paid that the policy said to review."
      lede="Both tests used invoices the system had never seen, built by a separate process from a written scenario list, with the answer key locked before any invoice was sent."
    >
      <Reveal>
        <div className="results">
          <div className="chart">
            <div className="eyebrow" style={{ marginBottom: 14 }}>Touchless rate · share of invoices paid with no human</div>
            <TouchChart />
            <p className="source">Industry figures: Ardent Partners 2025, real AP teams. Agent figures: synthetic blind test sets. Directional, not like for like.</p>
          </div>
          <div className="tbl-wrap">
            <table className="res">
              <thead>
                <tr><th>Measure</th><th>Blind test 1<br />v1.0.1</th><th>Blind test 2<br />v1.1</th></tr>
              </thead>
              <tbody>
                {resultsRows.map(([m, a, b, hi]) => (
                  <tr key={m}><td>{m}</td><td>{a}</td><td className={hi ? 'hi' : undefined}>{b}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>
    </Chapter>
  )
}

export function Broke() {
  return (
    <Chapter
      id="broke"
      eyebrow="07 · What broke"
      title="What broke, and what I did about it."
      lede="The first blind test found real failures. None of them paid an invoice the written policy said to review, and each one changed the design."
    >
      <Reveal>
        <div className="broke">
          {broke.map((b) => (
            <article className="case" key={b.h}>
              <div className="kpi num">{b.k}</div>
              <h3>{b.h}</h3>
              <dl>
                <dt>Cause</dt><dd>{b.c}</dd>
                <dt>{b.f}</dt><dd>{b.ft}</dd>
              </dl>
              <span className={'status ' + b.st}>{b.s}</span>
            </article>
          ))}
        </div>
        <p className="muted small" style={{ marginTop: 20, maxWidth: 'none' }}>{brokeNote}</p>
      </Reveal>
    </Chapter>
  )
}

export function Limits() {
  const col = (rows: string[][]) => (
    <ul>
      {rows.map(([b, s]) => (
        <li key={b}><b>{b}</b><span className="muted small">{s}</span></li>
      ))}
    </ul>
  )
  return (
    <section className="chapter" id="limits">
      <div className="wrap">
        <Reveal>
          <div className="chap-head">
            <div className="eyebrow">08 · Limits and v2</div>
            <div><h2>What it doesn't do yet.</h2></div>
          </div>
          <div className="limits">{col(limitsA)}{col(limitsB)}</div>
        </Reveal>
      </div>
    </section>
  )
}

export function About() {
  return (
    <section className="chapter" id="about">
      <div className="wrap about">
        <div>
          <div className="eyebrow">About</div>
          <h2 style={{ marginTop: 12 }}>Ebrahim Tahir Awan. A business analyst who puts AI into operations.</h2>
          <p className="lede" style={{ marginTop: 14 }}>
            MS Business Analytics, Arizona State University. I scope the process, write the rules, build the workflow and prove it works with tests.
          </p>
        </div>
        <div className="links">
          <a className="btn primary" href={links.github} target="_blank" rel="noopener">GitHub</a>
          <a className="btn" href={links.linkedin} target="_blank" rel="noopener">LinkedIn</a>
        </div>
      </div>
    </section>
  )
}

export function Nav() {
  const [label, setLabel] = useState('Theme')
  const cur = () => document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  useEffect(() => {
    const upd = () => setLabel(cur() === 'dark' ? 'Light mode' : 'Dark mode')
    upd()
    const mq = matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener('change', upd)
    return () => mq.removeEventListener('change', upd)
  }, [])
  return (
    <nav className="nav" aria-label="Sections">
      <div className="wrap">
        <div className="brand"><i>AP</i>AP Exception Agent</div>
        <ul>
          <li><a href="#problem">Problem</a></li>
          <li><a href="#policy">Diagnosis</a></li>
          <li><a href="#solution">Solution</a></li>
          <li><a href="#demo">Try it</a></li>
          <li><a href="#build">Build</a></li>
          <li><a href="#results">Results</a></li>
          <li><a href="#broke">What broke</a></li>
        </ul>
        <button
          className="theme-btn" id="themeBtn" type="button"
          onClick={() => {
            document.documentElement.dataset.theme = cur() === 'dark' ? 'light' : 'dark'
            setLabel(cur() === 'dark' ? 'Light mode' : 'Dark mode')
          }}
        >
          {label}
        </button>
      </div>
    </nav>
  )
}
