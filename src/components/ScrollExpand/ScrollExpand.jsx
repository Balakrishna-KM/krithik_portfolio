// STAND-IN for the React Bits ScrollExpand component (your original files were not received).
// It implements the same props, clip-path expansion, rAF smoothing, sticky stage and ResizeObserver.
// To use your real component: overwrite this file and ScrollExpand.css with yours. HeroExpand passes the same props.
import { useEffect, useRef } from 'react'
import './ScrollExpand.css'

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const lerp = (a, b, t) => a + (b - a) * t

export default function ScrollExpand({
  src, mediaType = 'video', poster, title, scrollHint,
  startWidth = 42, startHeight = 58, startRadius = 24, endRadius = 0, mediaZoom = 1.35,
  scrollDistance = 1.2, holdDistance = 0.35, smoothing = 0.1, overlayScrim = 0.45,
  useWindowScroll = true, children,
}) {
  const root = useRef(), media = useRef(), inner = useRef(), titleEl = useRef(), hint = useRef(), scrim = useRef(), overlay = useRef(), video = useRef()

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let vh = window.innerHeight, top = 0, target = 0, cur = 0, raf = 0

    const apply = (p) => {
      const insetX = (100 - lerp(startWidth, 100, p)) / 2, insetY = (100 - lerp(startHeight, 100, p)) / 2
      media.current.style.clipPath = `inset(${insetY}% ${insetX}% ${insetY}% ${insetX}% round ${lerp(startRadius, endRadius, p)}px)`
      inner.current.style.transform = `scale(${lerp(mediaZoom, 1, p)})`
      const t = clamp(1 - p * 2.2)
      titleEl.current.style.opacity = t
      titleEl.current.style.transform = `translateY(${-p * 50}px)`
      hint.current.style.opacity = clamp(1 - p * 6)
      scrim.current.style.opacity = overlayScrim * clamp((p - 0.6) / 0.4)
      const o = clamp((p - 0.85) / 0.15)
      overlay.current.style.opacity = o
      overlay.current.style.transform = `translateY(${(1 - o) * 30}px)`
      overlay.current.style.pointerEvents = p > 0.9 ? 'auto' : 'none'
    }
    const tick = () => {
      cur = reduce ? target : lerp(cur, target, smoothing)
      if (Math.abs(target - cur) < 0.0005) cur = target
      apply(cur)
      raf = cur === target ? 0 : requestAnimationFrame(tick)
    }
    const kick = () => { if (!raf) raf = requestAnimationFrame(tick) }
    const read = () => { target = clamp((window.scrollY - top) / (vh * scrollDistance)); kick() }
    const measure = () => { vh = window.innerHeight; top = root.current.getBoundingClientRect().top + window.scrollY; read() }

    measure(); cur = target; apply(cur)
    window.addEventListener('scroll', read, { passive: true })
    window.addEventListener('resize', measure)
    const ro = new ResizeObserver(measure); ro.observe(root.current); ro.observe(document.documentElement)

    // lazy playback: only play while visible
    let io
    if (video.current) {
      io = new IntersectionObserver(([e]) => (e.isIntersecting ? video.current.play().catch(() => {}) : video.current.pause()), { threshold: 0.05 })
      io.observe(root.current)
    }
    return () => {
      cancelAnimationFrame(raf); window.removeEventListener('scroll', read); window.removeEventListener('resize', measure); ro.disconnect(); io?.disconnect()
    }
  }, [startWidth, startHeight, startRadius, endRadius, mediaZoom, scrollDistance, smoothing, overlayScrim])

  return (
    <div ref={root} className="se" style={{ '--se-total': 1 + scrollDistance + holdDistance }}>
      <div className="se-stage">
        <div ref={media} className="se-media">
          <div ref={inner} className="se-inner">
            {src && mediaType === 'video' ? <video ref={video} src={src} poster={poster || undefined} muted loop playsInline preload="metadata" />
              : (src && mediaType === 'image') || poster ? <img src={src || poster} alt="" />
              : <div className="se-ph">Add your portrait<br /><small>profileImage in portfolioData.js</small></div>}
          </div>
        </div>
        <div ref={scrim} className="se-scrim" />
        <div ref={titleEl} className="se-title">{title}</div>
        <div ref={hint} className="se-hint">{scrollHint}</div>
        <div ref={overlay} className="se-overlay">{children}</div>
      </div>
    </div>
  )
}
