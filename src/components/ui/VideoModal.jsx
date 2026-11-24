import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

function Body({ item, onClose }) {
  useEffect(() => {
    window.__lenis?.stop()
    const esc = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', esc)
    return () => { window.__lenis?.start(); window.removeEventListener('keydown', esc) }
  }, [])
  return (
    <motion.div className="modal" role="dialog" aria-modal="true" aria-label={item.title} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div className="modal-body" initial={{ scale: 0.85, y: 60 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 40 }} transition={{ type: 'spring', stiffness: 220, damping: 26 }} onClick={(e) => e.stopPropagation()}>
        <button className="modal-x" onClick={onClose} aria-label="Close"><X size={20} /></button>
        {item.video ? <video src={item.video} poster={item.thumbnail || undefined} controls autoPlay playsInline />
          : <div className="ph" style={item.thumbnail ? { backgroundImage: `url(${item.thumbnail})` } : undefined}>Add a video URL for this item</div>}
        <small>{item.category}</small><h3>{item.title}</h3><p>{item.description}</p>
      </motion.div>
    </motion.div>
  )
}
export default function VideoModal({ item, onClose }) {
  return <AnimatePresence>{item && <Body key={item.id || item.title} item={item} onClose={onClose} />}</AnimatePresence>
}
