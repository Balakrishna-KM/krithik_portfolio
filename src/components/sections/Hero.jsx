import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import MaskText from '../ui/MaskText'
import Thumb from '../ui/Thumb'
import { portfolioData as d } from '../../data/portfolioData'
const go = (h) => window.__lenis?.scrollTo(h, { duration: 1.8 })

export default function Hero() {
  return (
    <section id="top" className="hero">
      <MaskText as="h1" lines={d.hero.headline} className="hero-mega" onLoad delay={0.2} />
      <motion.figure className="hero-portrait" initial={{ clipPath: 'inset(100% 0 0 0)' }} animate={{ clipPath: 'inset(0% 0 0 0)' }} transition={{ duration: 1.4, delay: 0.5, ease: [0.76, 0, 0.24, 1] }}>
        {d.profileImage ? <img src={d.profileImage} alt={d.name} fetchpriority="high" /> : <div className="ph">Add your portrait<br /><small>profileImage in portfolioData.js</small></div>}
      </motion.figure>
      <motion.div className="hero-l" initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.1, duration: 1 }}>
        <p>{d.hero.supporting}</p>
        <motion.button className="btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }} onClick={() => go('#work')}>EXPLORE MY WORK <ArrowRight size={18} /></motion.button>
      </motion.div>
      <motion.div className="hero-r" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.2, duration: 1 }}>
        <h2>{d.name}</h2><p>{d.title}</p>
      </motion.div>
      <div className="hero-cards">
        {d.projects.slice(0, 3).map((p, i) => (
          <button key={p.id} className="mini" style={{ animationDelay: `${-i * 1.6}s` }} onClick={() => go('#work')} data-hover>
            <Thumb p={p} i={i} className="mini-img" /><small>{p.category}</small>
          </button>
        ))}
      </div>
    </section>
  )
}
