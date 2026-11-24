import { motion } from 'framer-motion'
import MaskText from '../ui/MaskText'
import Tilt from '../ui/Tilt'
import { portfolioData as d } from '../../data/portfolioData'

export default function Services() {
  return (
    <section id="services" className="sec">
      <MaskText as="h2" lines={['EVERY FRAME', 'HAS A PURPOSE.']} className="h2 big" />
      <ul className="svc-grid">
        {d.services.map((s, i) => (
          <motion.li key={s.title} initial={{ opacity: 0, y: 60 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-8%' }} transition={{ delay: (i % 3) * 0.1, duration: 0.9 }} style={{ marginTop: i % 3 === 1 ? '2.5rem' : 0 }}>
            <Tilt className="svc" max={9}><span className="num">{String(i + 1).padStart(2, '0')}</span><h3>{s.title}</h3><p>{s.text}</p></Tilt>
          </motion.li>
        ))}
      </ul>
    </section>
  )
}
