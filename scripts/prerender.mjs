// Injects the server-rendered app into dist/index.html so the page is complete HTML without JavaScript.
import { readFileSync, writeFileSync, rmSync, readdirSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const ssr = resolve('dist-ssr', 'entry-server.js')
const { render } = await import(pathToFileURL(ssr).href)
const html = render()
const file = resolve('dist', 'index.html')
const page = readFileSync(file, 'utf8')
if (!page.includes('<!--app-html-->')) throw new Error('placeholder missing in dist/index.html')
// preload the fonts the first screen uses, so the text does not reflow when they arrive
const want = [/^bricolage-grotesque-latin-opsz-normal/, /^ibm-plex-sans-latin-400-normal/, /^ibm-plex-sans-latin-600-normal/, /^ibm-plex-mono-latin-400-normal/]
const base = '/ap-agent-site/assets/'
const links = readdirSync('dist/assets')
  .filter((f) => f.endsWith('.woff2') && want.some((r) => r.test(f)))
  .map((f) => `<link rel="preload" as="font" type="font/woff2" crossorigin href="${base}${f}">`)
  .join('\n')
writeFileSync(file, page.replace('<!--app-html-->', html).replace('</head>', links + '\n</head>'))
rmSync(resolve('dist-ssr'), { recursive: true, force: true })
console.log('prerendered', html.length, 'bytes of HTML')
