export const grad = (i) => `linear-gradient(${135 + i * 40}deg, #140a0a, ${i % 2 ? '#a9744a' : '#b5524b'}77)`
export default function Thumb({ p, i, className = '' }) {
  return <div className={className} style={{ background: p.thumbnail ? `url(${p.thumbnail}) center/cover` : grad(i) }} />
}
