import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { motion } from 'framer-motion'
import MaskText from '../ui/MaskText'
import { portfolioData as d } from '../../data/portfolioData'
import { reduced } from '../../lib/motion'

export default function Beyond() {
  const ref = useRef()
  useLayoutEffect(() => {
    if (reduced()) return
    const ctx = gsap.context(() => gsap.fromTo('.beyond-copy', { y: 70 }, { y: -70, ease: 'none', scrollTrigger: { trigger: ref.current, scrub: true } }), ref)
    return () => ctx.revert()
  }, [])
  return (
    <section id="beyond" ref={ref} className="beyond">
      <div className="lens-css" aria-hidden />
      <div className="beyond-copy">
        <MaskText as="h2" lines={d.beyond.headline} className="mega" />
        <motion.p initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 1 }}>{d.beyond.text}</motion.p>
      </div>
    </section>
  )
}
