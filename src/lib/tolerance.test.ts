import { test } from 'node:test'
import assert from 'node:assert/strict'
import { tolerance } from './tolerance.ts'

test('12,500 PO vs 12,580 invoice: 80 over, allowed 12.50*... cap 50 -> hold', () => {
  const t = tolerance(12500, 12580)
  assert.equal(t.diff, 80)
  assert.equal(t.pct, 125)
  assert.equal(t.limit, 50) // 0.1% = 12.50, floor 50
  assert.equal(t.allow, 50)
  assert.equal(t.ok, false)
})
test('exactly at the dollar cap pays (inclusive)', () => {
  assert.equal(tolerance(12500, 12550).ok, true)
  assert.equal(tolerance(12500, 12550.01).ok, false)
})
test('exactly 1% of a small PO pays; one cent more does not', () => {
  assert.equal(tolerance(1000, 1010).ok, true) // 1% = 10, cap 50
  assert.equal(tolerance(1000, 1010.01).ok, false)
})
test('large PO is bounded by the $500 cap', () => {
  const t = tolerance(1_000_000, 1_000_400)
  assert.equal(t.limit, 500)
  assert.equal(t.allow, 500)
  assert.equal(t.ok, true)
  assert.equal(tolerance(1_000_000, 1_000_500.01).ok, false)
})
test('0.1% rises above $50 for POs over $50,000', () => {
  const t = tolerance(80000, 80070)
  assert.equal(t.limit, 80)
  assert.equal(t.ok, true)
})
test('zero PO never pays; blank inputs are treated as zero', () => {
  assert.equal(tolerance(0, 10).ok, false)
  assert.equal(tolerance(NaN, NaN).diff, 0)
})
test('under-billing is also a difference', () => {
  assert.equal(tolerance(1000, 990).ok, true)
  assert.equal(tolerance(1000, 980).ok, false)
})
