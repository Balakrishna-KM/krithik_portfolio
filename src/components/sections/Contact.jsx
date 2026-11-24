import { useState } from 'react'
import { motion } from 'framer-motion'
import { portfolioData as d } from '../../data/portfolioData'
import MaskText from '../ui/MaskText'
export default function Contact() {
  const c = d.contact
  const [status, setStatus] = useState('')
  const links = [
    c.email && ['Email', `mailto:${c.email}`], c.whatsapp && ['WhatsApp', `https://wa.me/${c.whatsapp}`],
    c.instagram && ['Instagram', c.instagram], c.linkedin && ['LinkedIn', c.linkedin],
  ].filter(Boolean)
  const submit = async (e) => {
    e.preventDefault()
    const f = Object.fromEntries(new FormData(e.target))
    if (c.formEndpoint) {
      try { const r = await fetch(c.formEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(f) })
        if (!r.ok) throw 0; setStatus('Sent. I will reply soon.'); e.target.reset() } catch { setStatus('Could not send. Please email me directly.') }
    } else if (c.email) {
      window.location.href = `mailto:${c.email}?subject=${encodeURIComponent('Enquiry from ' + f.name)}&body=${encodeURIComponent(f.message + '\n\n' + f.name + ' (' + f.email + ')')}`
    } else setStatus('Add your email or formEndpoint in portfolio.js to enable the form.')
  }
  return (
    <section id="contact" className="sec contact">
      <MaskText lines={["LET'S CREATE", 'SOMETHING ICONIC.']} className="h2 big" />
      <div className="contact-stage"><div className="lens-css" aria-hidden /></div>
      <div className="contact-grid">
        <ul className="links">{links.length ? links.map(([l, h]) => <motion.li key={l} whileHover={{ x: 10 }}><a href={h} target="_blank" rel="noreferrer">{l}</a></motion.li>) : <li>Add contact details in portfolio.js</li>}</ul>
        <form onSubmit={submit}>
          <label>Name<input name="name" required autoComplete="name" /></label>
          <label>Email<input name="email" type="email" required autoComplete="email" /></label>
          <label>Project details<textarea name="message" rows="4" required /></label>
          <motion.button className="btn" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>Send enquiry</motion.button>
          <p role="status" className="status">{status}</p>
        </form>
      </div>
      <footer>© {new Date().getFullYear()} {d.name}</footer>
    </section>
  )
}
