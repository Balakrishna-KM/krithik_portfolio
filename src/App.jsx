import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { reduced } from './lib/motion'
import CinematicBackground from './components/CinematicBackground/CinematicBackground'
import Nav from './components/ui/Nav'
import Cursor from './components/ui/Cursor'
import Hero from './components/sections/Hero'
import Beyond from './components/sections/Beyond'
import ShowreelExpand from './components/sections/ShowreelExpand'
import Dive from './components/sections/Dive'
import Services from './components/sections/Services'
import About from './components/sections/About'
import Contact from './components/sections/Contact'
gsap.registerPlugin(ScrollTrigger)

export default function App() {
  // Single scroll system: Lenis moves the window; ScrollExpand, GSAP and the 3D scene all just read window.scrollY.
  useEffect(() => {
    const lenis = new Lenis({ lerp: reduced() ? 1 : 0.09 })
    window.__lenis = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (t) => lenis.raf(t * 1000)
    gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0)
    return () => { gsap.ticker.remove(tick); lenis.destroy(); ScrollTrigger.getAll().forEach((s) => s.kill()) }
  }, [])
  return (
    <>
      <CinematicBackground />
      <Cursor /><Nav />
      <main><Hero /><Beyond /><ShowreelExpand /><Dive /><Services /><About /><Contact /></main>
    </>
  )
}
