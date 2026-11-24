import { motion, useMotionValue, useSpring } from 'framer-motion'
export default function Tilt({ children, className = '', max = 10, ...rest }) {
  const rx = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 }), ry = useSpring(useMotionValue(0), { stiffness: 200, damping: 20 })
  const move = (e) => { const r = e.currentTarget.getBoundingClientRect(); ry.set(((e.clientX - r.left) / r.width - 0.5) * max * 2); rx.set(-((e.clientY - r.top) / r.height - 0.5) * max * 2) }
  return <motion.div className={className} style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }} onMouseMove={move} onMouseLeave={() => { rx.set(0); ry.set(0) }} {...rest}>{children}</motion.div>
}
