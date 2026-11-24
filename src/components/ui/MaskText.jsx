import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { reduced } from '../../lib/motion'
// Text masking reveal: each line slides up from behind an overflow mask.
export default function MaskText({ lines, as: Tag = 'h2', className = '', delay = 0, onLoad = false }) {
  const ref = useRef()
  useLayoutEffect(() => {
    if (reduced()) return
    const ctx = gsap.context(() => {
      gsap.from('.mt-in', { yPercent: 115, duration: 1.1, ease: 'power4.out', stagger: 0.12, delay,
        scrollTrigger: onLoad ? undefined : { trigger: ref.current, start: 'top 85%' } })
    }, ref)
    return () => ctx.revert()
  }, [])
  return <Tag ref={ref} className={className}>{lines.map((l, i) => <span className="mt" key={i}><span className="mt-in">{l}</span></span>)}</Tag>
}
