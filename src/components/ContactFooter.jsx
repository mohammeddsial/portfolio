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
        <div className="flex flex-wrap gap-3 justify-center mb-12 md:gap-4 md:mb-16">
          <a href="mailto:shersials@gmail.com"
            className="px-5 py-3 font-semibold no-underline rounded-xl transition-all duration-300 hover:-translate-y-1 hover:opacity-90 md:px-8 md:py-4"
            style={{ background: 'var(--accent)', color: 'var(--bg)' }}>
            ✉ Email Me
          </a>
          <a href="https://wa.me/923364199486" target="_blank" rel="noopener noreferrer"
            className="px-5 py-3 font-semibold no-underline rounded-xl border transition-all duration-300 hover:border-accent hover:-translate-y-1 md:px-8 md:py-4"
            style={{ background: 'var(--surface)', color: 'var(--text)', borderColor: 'rgba(255,255,255,0.1)' }}>
            💬 WhatsApp
          </a>
         
        </div>

        {/* Contact Details */}
        <div className="mx-auto max-w-sm text-left">
          <h3 className="mb-4 font-serif text-xl font-normal md:text-2xl md:mb-5">Get in touch</h3>
          <div className="space-y-3">
            <div className="flex gap-2 items-center md:gap-3">
              <span className="text-base md:text-lg" style={{ color: 'var(--accent)' }}>✉</span>
              <a href="mailto:shersials@gmail.com" className="text-sm no-underline transition-colors hover:text-accent md:text-base"
                style={{ color: 'var(--muted)' }}>shersials@gmail.com</a>
            </div>
            <div className="flex gap-2 items-center md:gap-3">
              <svg className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--accent)' }}>
                <path d="M12.031 2C6.51 2 2.032 6.48 2.032 12c0 2.19.71 4.23 1.92 5.89L2 22l4.23-1.89c1.55.95 3.4 1.51 5.39 1.51 5.52 0 10-4.48 10-10s-4.48-10-10-10zm0 18c-1.79 0-3.44-.57-4.79-1.54l-.34-.2-2.51 1.12.98-2.46-.21-.34c-1.1-1.51-1.77-3.31-1.77-5.2 0-4.62 3.76-8.38 8.38-8.38s8.38 3.76 8.38 8.38-3.76 8.38-8.38 8.38z"/>
              </svg>
              <a href="https://wa.me/923364199486" target="_blank" rel="noopener noreferrer"
                className="text-sm no-underline transition-colors hover:text-accent md:text-base"
                style={{ color: 'var(--muted)' }}>
                +92 336 4199486 (WhatsApp)
              </a>
            </div>
            <div className="flex gap-2 items-center md:gap-3">
              <svg className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--accent)' }}>
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
              <span className="text-sm md:text-base" style={{ color: 'var(--muted)' }}>Lahore, Pakistan · Available Worldwide</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="flex flex-col gap-4 justify-between items-center px-5 py-6 font-mono text-xs md:px-12 md:py-8 md:text-sm"
      style={{ color: 'var(--muted)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
      <div className="flex flex-wrap gap-4 justify-center items-center">
        <a href="https://www.linkedin.com/in/zahidshersial/" target="_blank" rel="noopener noreferrer"
          className="no-underline transition-colors hover:text-accent" style={{ color: 'var(--muted)' }}
          aria-label="Zahid Sher Sial on LinkedIn">LinkedIn</a>
        <a href="https://x.com/SherSial" target="_blank" rel="noopener noreferrer"
          className="no-underline transition-colors hover:text-accent" style={{ color: 'var(--muted)' }}
          aria-label="Zahid Sher Sial on X (Twitter)">X / Twitter</a>
        <a href="https://www.facebook.com/MZahidSherSial" target="_blank" rel="noopener noreferrer"
          className="no-underline transition-colors hover:text-accent" style={{ color: 'var(--muted)' }}
          aria-label="Zahid Sher Sial on Facebook">Facebook</a>
        <a href="https://dribbble.com/shersial" target="_blank" rel="noopener noreferrer"
          className="no-underline transition-colors hover:text-accent" style={{ color: 'var(--muted)' }}
          aria-label="Zahid Sher Sial on Dribbble">Dribbble</a>
        <a href="https://www.behance.net/shersials" target="_blank" rel="noopener noreferrer"
          className="no-underline transition-colors hover:text-accent" style={{ color: 'var(--muted)' }}
          aria-label="Zahid Sher Sial on Behance">Behance</a>
          <a href='https://contra.com/m_zahid_sher_sial/work ' target='_blank' rel='noopener noreferrer' className='no-underline transsition-colos hover:text-accent' style={{ color: 'var(--muted)' }}
          aria-label="Zahid Sher Sial on Contra" >Contra</a>
          <a href='https://gist.github.com/shersial ' target='_blank' rel='noopener noreferrer' className='no-underline transsition-colos hover:text-accent' style={{ color: 'var(--muted)' }}
          aria-label="Zahid Sher Sial on Gist" >Gist</a>
          <a href='https://www.pinterest.com/shersial/ ' target='_blank' rel='noopener noreferrer' className='no-underline transsition-colos hover:text-accent' style={{ color: 'var(--muted)' }}
          aria-label="Zahid Sher Sial on Pintrest" >Pintrest</a>
      </div>
      <div className="flex flex-col gap-2 items-center md:flex-row md:justify-between md:w-full">
        <span className="flex gap-2 items-center">
          <img src="/logo.webp" alt="Zahid Sher Sial — UI/UX Designer & Front-End Developer" className="h-4 md:h-5" style={{ filter: ' invert(1)' }} />
          <span>© 2025 · UI/UX Designer &amp; Developer</span>
        </span>
        <span>
          Lahore, PK · Available Globally ·{' '}
          <a href="mailto:shersials@gmail.com" className="no-underline transition-colors hover:text-accent"
            style={{ color: 'var(--muted)' }}>shersials@gmail.com</a>
        </span>
      </div>
    </footer>
  )
}
