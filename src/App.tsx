import Hero from './components/Hero'
import Demo from './components/Demo'
import { About, Broke, Build, Limits, Nav, Policy, Problem, Results, Solution } from './components/Sections'

export default function App() {
  return (
    <>
      <a href="#main" className="tw-sr-only focus:tw-not-sr-only focus:tw-absolute focus:tw-z-50 focus:tw-bg-white focus:tw-p-2">Skip to content</a>
      <Nav />
      <Hero />
      <main id="main">
        <Problem />
        <Policy />
        <Solution />
        <Demo />
        <Build />
        <Results />
        <Broke />
        <Limits />
        <About />
      </main>
      <footer>
        <div className="wrap">Portfolio project. All invoices, vendors and companies in the tests are synthetic. QuickBooks sandbox only.</div>
      </footer>
    </>
  )
}
