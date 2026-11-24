// Keeps ONE persistent 3D lens connected across all sections: it glides between these per-section poses.
const ids = ['top', 'beyond', 'showreel', 'work', 'services', 'about', 'contact']
const KF = [
  { x: 6.1, y: -2.5, s: 0.85 },  // hero: lower-right corner, clear of portrait and text
  { x: -3.4, y: 0, s: 2 },       // beyond the frame: large, left
  { x: 0, y: 0, s: 0 },          // showreel: hidden behind full-screen media
  { x: -6.3, y: -2.8, s: 0.55 }, // work: small corner accent
  { x: 6.3, y: 2.6, s: 0.65 },   // services: top-right
  { x: 6.4, y: -2.8, s: 0.55 },  // about: bottom-right
  { x: 0, y: 1.3, s: 2.2 },      // contact: big finale
]
let centers = []
export const measure = () => {
  centers = ids.map((id) => { const el = document.getElementById(id); if (!el) return 0; const r = el.getBoundingClientRect(); return r.top + window.scrollY + r.height / 2 })
}
export function frame(scrollY) {
  const c = scrollY + window.innerHeight / 2
  if (!centers.length) return KF[0]
  if (c <= centers[0]) return KF[0]
  let i = 0
  while (i < centers.length - 1 && c >= centers[i + 1]) i++
  if (i >= KF.length - 1) return KF[KF.length - 1]
  const t = Math.min(1, Math.max(0, (c - centers[i]) / (centers[i + 1] - centers[i])))
  const e = t * t * (3 - 2 * t), a = KF[i], b = KF[i + 1]
  return { x: a.x + (b.x - a.x) * e, y: a.y + (b.y - a.y) * e, s: a.s + (b.s - a.s) * e }
}
