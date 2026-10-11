/** Tailwind is used only for small utilities; the approved design lives in src/styles/mockup.css (preflight is off so it cannot change it). */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  prefix: 'tw-', // utilities are prefixed so they can never collide with the mockup class names (e.g. .fixed)
  corePlugins: { preflight: false },
  theme: { extend: {} },
  plugins: [],
}
