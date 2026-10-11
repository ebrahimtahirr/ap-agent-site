export interface DemoStep {
  s: 'p' | 'f' | 's'
  t: string
}
export interface DemoCase {
  id: string
  title: string
  sub: string
  image: string
  imageW: number
  imageH: number
  vendor: string
  invoice: string | null
  po: string | null
  total: string | null
  units: number | null
  decision: { action: string; type: string; path: string; reason?: string }
  steps: DemoStep[]
  outcome: { kind: 'pay' | 'hold'; title: string; text: string }
  hero?: { lines: { d: string; a: string }[]; more: number; checks: number[] }
}
