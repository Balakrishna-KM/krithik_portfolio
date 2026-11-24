import { useState } from 'react'
import { ArrowRight, Play } from 'lucide-react'
import ScrollExpand from '../ScrollExpand/ScrollExpand'
import VideoModal from '../ui/VideoModal'
import { portfolioData as d } from '../../data/portfolioData'

export default function ShowreelExpand() {
  const [open, setOpen] = useState(null)
  const video = d.showreel.expandMedia === 'video' && d.showreel.url
  return (
    <section id="showreel">
      <ScrollExpand
        src={video ? d.showreel.url : d.profileImage} mediaType={video ? 'video' : 'image'}
        poster={video ? d.showreel.thumbnail || d.profileImage : undefined}
        title="VISUALS THAT SPEAK LOUDER." scrollHint="SCROLL TO EXPERIENCE"
        startWidth={42} startHeight={58} startRadius={24} endRadius={0} mediaZoom={1.35}
        scrollDistance={1.2} holdDistance={0.35} smoothing={0.1} overlayScrim={0.45} useWindowScroll
      >
        <h2 className="mega">EVERY CUT<br />TELLS A STORY.</h2>
        <div className="row">
          <button className="btn" onClick={() => setOpen({ title: 'Showreel', category: 'SHOWREEL', description: '', video: d.showreel.url, thumbnail: d.showreel.thumbnail })}><Play size={16} /> WATCH SHOWREEL</button>
          <button className="btn ghost" onClick={() => window.__lenis?.scrollTo('#work', { duration: 1.8 })}>EXPLORE MY WORK <ArrowRight size={18} /></button>
        </div>
      </ScrollExpand>
      <VideoModal item={open} onClose={() => setOpen(null)} />
    </section>
  )
}
