import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { portfolioData as portfolio } from '../../data/portfolioData'
const links = [['Showreel', '#showreel'], ['Work', '#work'], ['Services', '#services'], ['About', '#about'], ['Contact', '#contact']]
export default function Nav() {
  const [open, setOpen] = useState(false)
  const go = (e, href) => { e.preventDefault(); setOpen(false); window.__lenis ? window.__lenis.scrollTo(href, { duration: 1.6 }) : document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' }) }
  return (
    <header className="nav">
      <a href="#top" className="logo" onClick={(e) => go(e, '#top')}>{portfolio.name}</a>
      <nav className="nav-desk">{links.map(([l, h]) => <motion.a key={h} href={h} onClick={(e) => go(e, h)} whileHover={{ y: -2 }}>{l}</motion.a>)}</nav>
      <button className="burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? 'Close' : 'Menu'}</button>
      <AnimatePresence>{open && (
        <motion.nav className="nav-mob" initial={{ clipPath: 'inset(0 0 100% 0)' }} animate={{ clipPath: 'inset(0 0 0% 0)' }} exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}>
          {links.map(([l, h]) => <a key={h} href={h} onClick={(e) => go(e, h)}>{l}</a>)}
        </motion.nav>)}</AnimatePresence>
    </header>
  )
}
