import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Play } from 'lucide-react'
import MaskText from '../ui/MaskText'
import Tilt from '../ui/Tilt'
import Thumb, { grad } from '../ui/Thumb'
import VideoModal from '../ui/VideoModal'
import { portfolioData as d } from '../../data/portfolioData'

export default function Dive() {
  const ps = d.projects
  const [a, setA] = useState(0)
  const [open, setOpen] = useState(null)
  const calm = useReducedMotion()
  const cur = ps[a]
  const card = (i, cls) => (
    <Tilt key={ps[i].id} className={`fcard ${cls} ${i === a ? 'on' : ''}`}>
      <button onMouseEnter={() => setA(i)} onFocus={() => setA(i)} onClick={() => setOpen(ps[i])} data-hover>
        <Thumb p={ps[i]} i={i} className="fc-img" /><small>{ps[i].category}</small><h3>{ps[i].title}</h3>
      </button>
    </Tilt>
  )
  const left = [0, 1], right = ps.map((_, i) => i).slice(2)
  return (
    <section id="work" className="dive">
      <div className="grid-floor" aria-hidden />
      <MaskText as="h2" lines={['DIVE INTO MY', 'CREATIVE WORLD']} className="h2 big center" />
      <ul className="chips" role="tablist">{ps.map((p, i) => <li key={p.id}><button role="tab" aria-selected={i === a} className={i === a ? 'on' : ''} onClick={() => setA(i)}>{p.category}</button></li>)}</ul>
      <div className="stage">
        <div className="col l">{left.map((i, k) => card(i, k ? 'lo' : ''))}</div>
        <Tilt className="phone-wrap" max={8}>
          <motion.button className="phone" onClick={() => setOpen(cur)} aria-label={`Open ${cur.title}`} data-hover
            animate={calm ? undefined : { y: [0, -14, 0] }} transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}>
            <span className="notch" />
            <AnimatePresence mode="wait">
              <motion.div key={a} className="screen" initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
                style={{ background: cur.thumbnail ? `url(${cur.thumbnail}) center/cover` : grad(a) }}>
                {cur.video && <video src={cur.video} muted loop autoPlay playsInline preload="none" />}
                <div className="screen-info"><small>{cur.category}</small><h3>{cur.title}</h3><span className="play"><Play size={18} /></span></div>
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </Tilt>
        <div className="col r">{right.map((i, k) => card(i, k % 2 ? 'lo' : ''))}</div>
      </div>
      <VideoModal item={open} onClose={() => setOpen(null)} />
    </section>
  )
}
