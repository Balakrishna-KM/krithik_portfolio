import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { reduced, isMobile } from '../../lib/motion'
import './CinematicBackground.css'

const Scene3D = lazy(() => import('./CinematicScene'))

// Abstract editing timeline: tracks, clips, waveform, ruler, keyframes, playhead. No real software UI or logos.
function Timeline() {
  const d = useMemo(() => {
    const rnd = (i) => Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1
    const tracks = [60, 112, 164].map((y, t) => {
      const clips = []; let x = 40 + t * 70, i = t * 20
      while (x < 1500) { const w = 90 + rnd(i++) * 220; clips.push([x, Math.min(w, 1560 - x)]); x += w + 14 + rnd(i++) * 30 }
      return { y, clips }
    })
    const wave = Array.from({ length: 150 }, (_, i) => [40 + i * 10, 5 + Math.abs(Math.sin(i * 0.37) * Math.sin(i * 0.11 + 1)) * 40 + rnd(i) * 6])
    const ticks = Array.from({ length: 76 }, (_, i) => 40 + i * 20)
    const kfs = [[260, 60], [610, 112], [940, 164], [1280, 112], [1420, 60], [430, 164]]
    return { tracks, wave, ticks, kfs }
  }, [])
  return (
    <div className="cb-layer cb-tl" aria-hidden>
      <svg viewBox="0 0 1600 360" preserveAspectRatio="none">
        {d.ticks.map((x, i) => <line key={x} className="tick" x1={x} x2={x} y1="8" y2={i % 5 ? 16 : 24} />)}
        {d.tracks.map((t, ti) => t.clips.map(([x, w], i) => <rect key={`${ti}-${i}`} className={`clip ${(i + ti) % 3 === 0 ? 'm' : ''}`} x={x} y={t.y - 18} width={w} height="36" rx="5" />))}
        {d.kfs.map(([x, y], i) => <rect key={i} className="kf" x={x - 4} y={y - 4} width="8" height="8" transform={`rotate(45 ${x} ${y})`} />)}
        {d.wave.map(([x, h], i) => <line key={i} className="wave" x1={x} x2={x} y1={290 - h} y2={290 + h} />)}
        <g className="ph"><line x1="0" x2="0" y1="0" y2="340" /><path d="M-8 0h16l-8 14z" /></g>
      </svg>
    </div>
  )
}

export default function CinematicBackground() {
  const ref = useRef()
  const [on3D, setOn3D] = useState(false)

  // Smoothly interpolated parallax for the CSS layers: a single listener, rAF only while something is moving.
  useEffect(() => {
    if (reduced()) return
    const el = ref.current
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0
    const loop = () => {
      cx += (tx - cx) * 0.06; cy += (ty - cy) * 0.06
      el.style.setProperty('--mx', cx.toFixed(3)); el.style.setProperty('--my', cy.toFixed(3)); el.style.setProperty('--sy', String(Math.round(window.scrollY)))
      raf = Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001 ? requestAnimationFrame(loop) : 0
    }
    const kick = () => { if (!raf) raf = requestAnimationFrame(loop) }
    const move = (e) => { tx = e.clientX / window.innerWidth - 0.5; ty = e.clientY / window.innerHeight - 0.5; kick() }
    window.addEventListener('pointermove', move, { passive: true }); window.addEventListener('scroll', kick, { passive: true })
    return () => { cancelAnimationFrame(raf); window.removeEventListener('pointermove', move); window.removeEventListener('scroll', kick) }
  }, [])

  // 3D loads after first paint; skipped on phones and for reduced motion (CSS layers remain).
  useEffect(() => {
    const id = setTimeout(() => setOn3D(!reduced() && !isMobile()), 500)
    return () => clearTimeout(id)
  }, [])
  useEffect(() => { document.body.classList.toggle('has3d', on3D); return () => document.body.classList.remove('has3d') }, [on3D])

  return (
    <div ref={ref} className="cb" aria-hidden>
      <div className="cb-layer cb-grad" />
      <div className="cb-layer cb-spot" />
      <div className="cb-layer cb-beams"><i className="cb-beam" /><i className="cb-beam" /><i className="cb-beam" /></div>
      <Timeline />
      {on3D && <div className="cb-canvas"><Suspense fallback={null}><Scene3D /></Suspense></div>}
      <div className="cb-layer cb-fog" />
      <div className="cb-vig" />
      <div className="cb-grain" />
    </div>
  )
}
