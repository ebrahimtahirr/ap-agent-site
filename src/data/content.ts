// All copy and numbers live here. Figures come from FINAL_RESULTS.md and heldout/results*.md of the AP project;
// the Ardent Partners benchmarks are external and cited as in the approved mockup.

export const heroStats = [
  { n: '0', l: 'invoices paid that the written policy said a person should review, across 392 blind invoices' },
  { n: '65.2%', l: 'paid with no human touch in blind test 2, vs 32.6% industry average' },
  { n: '80.4%', l: 'of blind test 2 decisions matching the written AP policy' },
  { n: '~1¢', l: 'AI cost per invoice processed' },
]

export const bench = [
  { t: 'Touchless rate', avg: 32.6, best: 49.2, max: 60, u: '%' },
  { t: 'Exception rate', avg: 14, best: 9, max: 20, u: '%' },
  { t: 'Cost per invoice', avg: 9.4, best: 2.78, max: 12, u: '$' },
  { t: 'Cycle time', avg: 9.2, best: 3.1, max: 12, u: ' days' },
]

export const rules = [
  ['§1', 'Known vendor', 'The name must match the vendor master or a registered alias, ignoring case and punctuation.'],
  ['§2', 'Valid purchase order', "No PO, or a PO that doesn't exist, goes to a person."],
  ['§3', 'Amount within tolerance', 'Pay only if the difference is at most 1% and at most a dollar limit that scales with the PO.'],
  ['§4', 'Quantity received', 'Billed quantity must match what the warehouse received. Partial shipments are billed pro rata.'],
  ['§5', 'No double payment', 'Same vendor, amount and PO as an earlier invoice is a duplicate. Only the first one is paid.'],
  ['§6', 'Readable', "If the amount or date can't be read with confidence, a person reads it."],
]

export type NodeKind = 'code' | 'ai' | 'ops'
export const tagTxt: Record<NodeKind, string> = { code: 'CODE', ai: 'AI', ops: 'SYSTEM' }
export const nodes: { k: NodeKind; s: string; n: string; d: string; w: string }[] = [
  { k: 'ops', s: 'Intake', n: 'Gmail inbox', d: 'Polls the AP mailbox every 5 minutes. Every attachment is logged, including zips, empty emails and non-PDFs, so nothing is lost.', w: 'Logging every email before processing is what turned 69 silent drops into 0.' },
  { k: 'ai', s: 'Extract', n: 'Read the document', d: 'Claude reads the PDF or scan and returns vendor, invoice number, PO, dates and each line item in a fixed schema.', w: 'Reading messy layouts is what models are good at. Anything it cannot read confidently is flagged, never guessed.' },
  { k: 'code', s: 'Vendor', n: 'Vendor master', d: 'Matches the printed name to 154 vendors and 265 aliases, ignoring case and punctuation, and gets the QuickBooks vendor ID.', w: 'Fuzzy matching by a model could pay the wrong company. An exact alias table cannot.' },
  { k: 'code', s: 'Match', n: 'PO and receipt', d: 'Looks up the PO and the goods receipts and sums received quantity per PO.', w: 'A database join is exact and auditable.' },
  { k: 'code', s: 'Variance', n: 'Amount and quantity', d: 'Computes the variance and applies the 1% and dollar-limit rule, pro rata for partial shipments. Code sums the line quantities.', w: 'In blind test 1 the model got quantity totals wrong on 90 invoices. Arithmetic belongs in code.' },
  { k: 'code', s: 'Duplicate', n: 'Earlier twin?', d: 'Same vendor, amount and PO as an invoice that arrived earlier is held, whatever its invoice number.', w: 'Arrival order decides which copy is the original, so the check runs before any payment.' },
  { k: 'ai', s: 'Judgment', n: 'Explain the case', d: 'For edge cases the model writes the reason a reviewer will read, from the facts the code produced.', w: 'The model explains. The rules decide.' },
  { k: 'ops', s: 'Act', n: 'Bill or escalate', d: 'Clean invoices become QuickBooks bills, after checking no bill already exists. Exceptions go to Slack and a resolution form.', w: 'The existing-bill check closed the double-billing gap from the first blind test.' },
]

export const stepNames = ['Intake', 'Extract', 'Vendor', 'PO match', 'Amount', 'Quantity', 'Duplicate']
export const stepKinds: NodeKind[] = ['ops', 'ai', 'code', 'code', 'code', 'code', 'code']
export const heroChecks = ['Known vendor', 'Valid PO', 'Amount within tolerance', 'Quantity received', 'Not a duplicate']

export const stack = ['n8n', 'PostgreSQL', 'Claude Haiku 4.5', 'QuickBooks Online API', 'Gmail', 'Slack', 'Docker', 'Python eval harness']
export const gate = [
  'zero invoices are paid that policy says should go to a person',
  'no more than one invoice gets worse than before',
  'all 15 vendor-name probes resolve correctly',
]
export const timeline = [
  ['v1.0', 'Core agent', 'Intake, extraction, three-way match, vendor master with 265 aliases, QuickBooks bills, Slack escalations, resolution form.'],
  ['Gate', 'Regression set reaches 197/197', 'Up from 95.4% on the first clean run, with zero false payments throughout.'],
  ['Blind test 1', '300 unseen invoices, 51.0% policy match', 'No payment the policy said to review, but 69 invoices silently ignored and one double bill. Scored once, then frozen.'],
  ['v1.1', 'Five fixes, each through the gate', 'Never drop silently, code sums line items, longer outputs, check QuickBooks before billing, ignore logo text.'],
  ['Blind test 2', '100 new invoices (92 scored), new layouts, 80.4% policy match', 'No payment the policy said to review, zero ignored. Answer key hashed before the run and scored once.'],
]

export const touch = [
  { l: 'Industry average', v: 32.6, a: false },
  { l: 'Blind test 1 · v1.0.1', v: 33.7, a: false },
  { l: 'Best-in-class AP', v: 49.2, a: false },
  { l: 'Blind test 2 · v1.1', v: 65.2, a: true },
]
export const resultsRows: [string, string, string, boolean][] = [
  ['Invoices scored', '300', '92', false],
  ['Paid when policy said review', '0', '0', true],
  ['Silently ignored', '69', '0', true],
  ['Paid with no human', '33.7%', '65.2%', true],
  ['Matches written policy', '51.0%', '80.4%', true],
  ['Unnecessary escalations', '81', '18', true],
  ['Cost per invoice', '$0.010', '$0.010', false],
]

export const broke = [
  { k: '69', h: 'Invoices silently ignored', c: 'Documents titled "Statement / invoice" (35), "Field receipt" (16) and "Credit memo" (15) were classed as not invoices, and 3 emails had no usable PDF. Nobody was told.', f: 'Fix', ft: "Anything the agent can't process now becomes a review item with a Slack alert.", s: 'FIXED IN v1.1 · 69 → 0', st: 'fixed' },
  { k: '1', h: 'Invoice billed twice', c: 'QuickBooks timed out after creating the bill. The retry created a second one.', f: 'Fix', ft: 'Before billing, the agent checks QuickBooks for an existing bill with the same vendor and invoice number.', s: 'FIXED IN v1.1', st: 'fixed' },
  { k: '90', h: 'Quantity totals misread', c: 'The model added up line quantities itself and got it wrong. A cross-check caught every one, but each became a needless escalation.', f: 'Fix', ft: 'The model only reads the lines. Code does the sum. Replaying blind test 1 on v1.1, quantity accuracy went from 56% to 99% (a development set by then, not blind).', s: 'FIXED IN v1.1', st: 'fixed' },
  { k: '534', h: 'Silent mailbox failures', c: 'The Gmail login expired. Polling failed 534 times and no alert fired, because errors in a trigger never reach the error workflow.', f: 'Next', ft: 'A heartbeat check that alerts when no mail has been read for 30 minutes.', s: 'OPEN · v2', st: 'v2' },
]
export const brokeNote =
  'One more finding, and it is a gap in the policy rather than a failure of it: in blind test 1, 3 invoices with changed bank details were paid, because the written policy has no bank-detail check. The fix is on the v2 list below (remittance change hold).'

export const limitsA = [
  ['Statement-style invoices go to a person', '14 of the 18 blind test 2 misses. Cautious, and the cheapest kind of error.'],
  ["Bank detail changes aren't checked", 'A common fraud vector. Needs a vendor bank master. In blind test 1 three such invoices were paid.'],
  ['Tested on synthetic invoices', "Realistic layouts and scans, but not a real company's mail."],
]
export const limitsB = [
  ['v2 · Mailbox heartbeat alert', 'Catch a dead connection within 30 minutes.'],
  ['v2 · Remittance change hold', 'Any new bank details pause payment until verified.'],
  ['v2 · Credit notes and multi-currency', 'Out of scope for v1 by policy.'],
]

export const links = {
  github: 'https://github.com/ebrahimtahirr',
  linkedin: 'https://www.linkedin.com/in/m-ebrahim-tahir-awan-660029231/',
}
