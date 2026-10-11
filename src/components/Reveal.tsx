import { useEffect, useRef, useState, type ReactNode } from 'react'
import { LazyMotion, domAnimation, m, useInView } from 'framer-motion'

/** Subtle scroll-in. The server HTML (and the first client render) is fully visible, so nothing depends on JS.
 *  After mount, blocks that start below the fold are hidden and then fade in when they scroll into view. */
export default function Reveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -8% 0px' })
  const [armed, setArmed] = useState(false)
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = ref.current
    if (el && el.getBoundingClientRect().top > window.innerHeight) setArmed(true)
  }, [])
  const hidden = armed && !inView
  return (
    <LazyMotion features={domAnimation} strict>
    <m.div
      ref={ref}
      initial={false}
      animate={hidden ? { opacity: 0, y: 14 } : { opacity: 1, y: 0 }}
      transition={{ duration: hidden ? 0 : 0.5, ease: 'easeOut' }}
    >
      {children}
    </m.div>
    </LazyMotion>
  )
}
