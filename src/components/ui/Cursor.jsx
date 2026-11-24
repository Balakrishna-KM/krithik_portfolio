import { useEffect, useRef } from 'react'
import gsap from 'gsap'
export default function Cursor() {
  const dot = useRef(), ring = useRef()
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    document.body.classList.add('has-cursor')
    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.1 }), dy = gsap.quickTo(dot.current, 'y', { duration: 0.1 })
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.45 }), ry = gsap.quickTo(ring.current, 'y', { duration: 0.45 })
    const move = (e) => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY) }
    const over = (e) => ring.current.classList.toggle('big', !!e.target.closest('a,button,input,textarea,[data-hover]'))
    window.addEventListener('mousemove', move); window.addEventListener('mouseover', over)
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseover', over); document.body.classList.remove('has-cursor') }
  }, [])
  return <><div ref={ring} className="cur-ring" /><div ref={dot} className="cur-dot" /></>
}
