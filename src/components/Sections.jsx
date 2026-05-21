export function TrustedBy() {
  return (
    <section className="py-8 px-5 text-center md:py-12 md:px-[5%]" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <p className="font-mono text-xs uppercase tracking-[2px] mb-6 md:text-sm md:mb-8" style={{ color: '#64748b' }}>
        Trusted by brands across UAE &amp; Globally
      </p>
      <div className="flex flex-wrap gap-6 justify-center md:gap-10" style={{ opacity: 0.6, filter: 'grayscale(1)' }}>
        {['UAE Government', 'Edarat', 'Al Ghurair', 'Toptal'].map(b => (
          <span key={b} className="text-base font-bold text-white md:text-lg">{b}</span>
        ))}
      </div>
    </section>
  )
}

export function Stats() {
  const stats = [
    { val: '32+', label: 'Projects Delivered' },
    { val: '16yr', label: 'Industry Experience' },
    { val: '5', label: 'Countries Worked In' },
    { val: 'MENA', label: 'Regional Expertise' },
  ]
  return (
    <div className="px-5 py-8 md:px-12 md:py-10" style={{ background: 'var(--surface)', borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <div className="grid grid-cols-2 gap-6 mx-auto max-w-6xl md:grid-cols-4 md:gap-8">
        {stats.map(s => (
          <div key={s.val}>
            <div className="font-serif text-3xl leading-none md:text-4xl" style={{ color: 'var(--accent)' }}>{s.val}</div>
            <div className="mt-1 font-mono text-xs uppercase md:mt-2 md:text-sm" style={{ color: 'var(--muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function About() {
  const certs = [
    { label: 'Certification', name: 'Front-End Development', issuer: 'Meta' },
    { label: 'Certification', name: 'Webflow Layouts', issuer: 'Webflow University' },
    { label: 'Certification', name: 'Adobe Certified Expert', issuer: 'Adobe · Site Power' },
    { label: 'Experience', name: 'Liferay DXP Developer', issuer: 'Udemy' },
  ]

  return (
    <div id="about" className="grid grid-cols-1 gap-10 px-5 py-16 items-center lg:grid-cols-2 lg:gap-20 lg:px-[5%] lg:py-24"
      style={{ background: 'var(--bg)', borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
      <div>
        <div className="reveal mb-3 font-mono text-xs tracking-wider uppercase md:mb-4 md:text-sm" style={{ color: 'var(--accent)' }}>
          About Me
        </div>
        <h2 className="reveal font-serif mb-4 md:mb-6" style={{ fontSize: 'clamp(28px,4vw,48px)', color: 'var(--text)', lineHeight: 1.2 }}>
          16 years of craft,<br />delivered at scale.
        </h2>
        <p className="reveal text-base leading-relaxed mb-4 max-w-[540px] md:text-lg md:mb-5" style={{ color: 'var(--muted)' }}>
          I'm — a UI/UX Designer and Front-End Developer based in Lahore, Pakistan, with
          deep roots across the UAE, UK, and Canada. I've shipped digital products for UAE government
          departments, global FinTech platforms, EdTech startups, and enterprise cloud brands.
        </p>
        <p className="reveal text-base leading-relaxed mb-5 max-w-[540px] md:text-lg" style={{ color: 'var(--muted)' }}>
          My work spans Webflow, WordPress, React, Next.js, Figma, and Tailwind — and I use AI
          tools like Claude and Cursor to deliver faster, better, and at a standard most agencies
          charge triple for.
        </p>
        
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:gap-4">
        {certs.map(c => (
          <div key={c.name} className="cert-card reveal">
            <div className="mb-1 font-mono uppercase text-sm md:mb-2" style={{ color: 'var(--accent)', opacity: 0.8 }}>{c.label}</div>
            <div className="mb-1 font-sans text-sm font-semibold md:text-base" style={{ color: 'var(--text)' }}>{c.name}</div>
            <div className="font-sans text-xs md:text-sm" style={{ color: 'var(--muted)' }}>{c.issuer}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
