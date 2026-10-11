/** The AP policy's amount tolerance (section 3): pay only if the difference is at most 1% of the PO
 *  AND at most min($500, max($50, 0.1% of the PO)). Same rule as the engine's "Compute Variance" step. */
export interface Tolerance {
  diff: number
  diffPct: number | null
  pct: number
  limit: number
  allow: number
  ok: boolean
}

export function tolerance(po: number, invoice: number): Tolerance {
  const P = Number.isFinite(po) ? po : 0
  const I = Number.isFinite(invoice) ? invoice : 0
  const diff = Math.abs(I - P)
  const pct = P * 0.01
  const limit = Math.min(500, Math.max(50, P * 0.001))
  const allow = Math.min(pct, limit)
  return { diff, diffPct: P ? (diff / P) * 100 : null, pct, limit, allow, ok: P > 0 && diff <= allow + 1e-9 }
}

export const fmt = (n: number) =>
  '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
