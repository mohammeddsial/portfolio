import { useState } from 'react'

export function Services() {
  const services = [
    {
      icon: '◈',
      title: 'UI / UX Design',
      desc: 'Research-backed design systems, wireframes, interactive prototypes, and pixel-perfect handoff — for web, SaaS, and mobile.',
      tags: ['Figma', 'Prototyping', 'Design Systems', 'User Research'],
    },
    {
      icon: '⬡',
      title: 'Frontend Development',
      desc: 'High-performance, accessible frontend engineering with modern frameworks — from marketing sites to complex SaaS dashboards.',
      tags: ['React / Next.js', 'WordPress', 'Webflow', 'Elementor'],
    },
    {
      icon: '⟡',
      title: 'AI-Assisted Development',
      desc: 'Using Claude, Cursor AI, and custom tooling to build faster, smarter, and ship production-grade code with fewer iterations.',
      tags: ['Claude / Anthropic', 'Cursor AI', 'Prompt Engineering', 'Custom Tools'],
    },
  ]

  return (
    <section id="skills" className="px-5 py-16 md:px-12 md:py-24"
      style={{ background: 'var(--bg)', borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-3 font-mono text-xs tracking-wider text-center uppercase md:mb-4 md:text-sm" style={{ color: 'var(--accent)' }}>
          What I Bring
        </div>
        <h2 className="font-serif text-3xl font-normal text-center mb-10 md:mb-16" style={{ fontSize: 'clamp(24px,3vw,38px)' }}>
          Services &amp; Expertise
        </h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
          {services.map(s => (
            <div key={s.title} className="skill-card reveal">
              <div className="mb-3 text-2xl md:text-3xl" style={{ color: 'var(--accent)' }}>{s.icon}</div>
              <div className="mb-2 font-serif text-lg md:text-xl">{s.title}</div>
              <div className="mb-3 text-xs leading-relaxed md:text-sm" style={{ color: 'var(--muted)' }}>{s.desc}</div>
              <div className="flex flex-wrap gap-1 md:gap-2">
                {s.tags.map(tag => (
                  <span key={tag} className="pill text-xs md:px-3 md:py-1.5">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Contact() {
  const [formStatus, setFormStatus] = useState(null)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormStatus('loading')
    try {
      // ⚠️ REPLACE THIS with your actual Formspree ID
      const response = await fetch('https://formspree.io/f/mqegywog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (response.ok) {
        setFormStatus('success')
        setFormData({ name: '', email: '', message: '' })
      } else {
        setFormStatus('error')
      }
    } catch (error) {
      setFormStatus('error')
    }
  }

  return (
    <section id="contact" className="relative z-10 px-5 py-20 text-center md:px-12 md:py-32">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-4 font-serif text-3xl leading-tight md:text-5xl md:mb-6">
          Let's build something<br />
          <em className="not-italic" style={{ color: 'var(--accent)' }}>remarkable</em> together.
        </h2>
        <p className="mb-8 text-base md:text-lg md:mb-10" style={{ color: 'var(--muted)' }}>
          16 years of experience. Available globally. Response within 24 hours.
        </p>

        {/* Contact Form */}
        <div className="max-w-md mx-auto mb-12 text-left">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-mono mb-1" style={{ color: 'var(--muted)' }}>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border focus:outline-none"
                style={{ background: 'var(--surface)', borderColor: 'rgba(255,255,255,0.1)', color: 'var(--text)' }}
              />
            </div>
            <div>
              <label className="block text-sm font-mono mb-1" style={{ color: 'var(--muted)' }}>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border focus:outline-none"
                style={{ background: 'var(--surface)', borderColor: 'rgba(255,255,255,0.1)', color: 'var(--text)' }}
              />
            </div>
            <div>
              <label className="block text-sm font-mono mb-1" style={{ color: 'var(--muted)' }}>Message / Project details</label>
              <textarea
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border focus:outline-none"
                style={{ background: 'var(--surface)', borderColor: 'rgba(255,255,255,0.1)', color: 'var(--text)' }}
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={formStatus === 'loading'}
              className="w-full px-5 py-3 font-semibold rounded-xl transition-all duration-300 hover:-translate-y-1"
              style={{ background: 'var(--accent)', color: 'var(--bg)' }}
            >
              {formStatus === 'loading' ? 'Sending...' : 'Send Message →'}
            </button>
            {formStatus === 'success' && (
              <p className="text-sm text-center mt-3" style={{ color: '#7de2c4' }}>✓ Message sent! I'll reply within 24h.</p>
            )}
            {formStatus === 'error' && (
              <p className="text-sm text-center mt-3" style={{ color: '#e87a7a' }}>❌ Error. Please email me directly at shersials@gmail.com</p>
            )}
          </form>
        </div>

        {/* Action Buttons */}


        {/* Contact Details */}

      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="flex flex-col gap-4 justify-between items-center px-5 py-6 font-mono text-xs md:px-12 md:py-8 md:text-sm"
      style={{ color: 'var(--muted)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
      
    </footer>
  )
}
