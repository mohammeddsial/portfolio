import { useState, useEffect, useRef } from 'react'

export default function Nav({ theme, toggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const hamburgerRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => {
      let current = ''
      document.querySelectorAll('section[id], div[id]').forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 200) current = sec.getAttribute('id')
      })
      setActiveSection(current)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && menuOpen) {
        setMenuOpen(false)
        document.body.style.overflow = ''
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [menuOpen])

  const toggleMenu = () => {
    setMenuOpen(prev => {
      document.body.style.overflow = !prev ? 'hidden' : ''
      return !prev
    })
  }

  const closeMenu = () => {
    setMenuOpen(false)
    document.body.style.overflow = ''
  }

  const scrollTo = (e, id) => {
    e.preventDefault()
    closeMenu()
    const el = document.querySelector(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const navLinks = [
    { href: '#work', label: 'Case Studies' },
    { href: '#webflow', label: 'Projects' },
    { href: '#skills', label: 'Services' },
    { href: '#contact', label: 'Contact' },
  ]

  const isActive = (href) => activeSection && href === `#${activeSection}`

  return (
    <>
      <nav>
        <a href="#" onClick={e => scrollTo(e, 'body')} className="nav-logo">
          <img src="/logo.webp" alt="Sher logo" className="h-8 md:h-9"  />
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex gap-6 lg:gap-8 list-none m-0 p-0">
          {navLinks.map(l => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={e => scrollTo(e, l.href)}
                className={`text-sm font-medium no-underline transition-all duration-300 hover:text-accent ${isActive(l.href) ? 'text-accent' : 'text-muted'}`}
                style={{ color: isActive(l.href) ? 'var(--accent)' : undefined }}
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
          <a href="#contact" onClick={e => scrollTo(e, '#contact')} className="px-5 py-2 text-sm font-semibold no-underline rounded-full"
  style={{ background: 'var(--accent)', color: 'var(--bg)' }}>
  Hire Me
</a>
          </li>
        </ul>

        {/* Desktop theme toggle */}
        <div className="hidden md:flex items-center gap-3">
          <button onClick={toggleTheme}
            className="p-2 text-lg rounded-full transition-colors duration-300 border"
            style={{ background: 'var(--surface)', borderColor: 'rgba(255,255,255,0.1)', color: 'var(--muted)' }}>
            {theme === 'dark' ? '🌞' : '🌙'}
          </button>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-3 md:hidden">
          <button onClick={toggleTheme}
            className="p-2 text-lg rounded-full border"
            style={{ background: 'var(--surface)', borderColor: 'rgba(255,255,255,0.1)', color: 'var(--muted)' }}>
            {theme === 'dark' ? '🌞' : '🌙'}
          </button>
          <button
            ref={hamburgerRef}
            onClick={toggleMenu}
            className={`hamburger flex flex-col justify-around w-6 h-6 focus:outline-none bg-transparent border-none cursor-pointer${menuOpen ? ' open' : ''}`}
          >
            <span className="block w-full h-0.5 bg-white" style={{ transformOrigin: 'center' }} />
            <span className="block w-full h-0.5 bg-white" style={{ transformOrigin: 'center' }} />
            <span className="block w-full h-0.5 bg-white" style={{ transformOrigin: 'center' }} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div id="mobileMenu" className={menuOpen ? 'open' : ''} style={{ background: 'var(--bg)' }}>
        {navLinks.map(l => (
          <a key={l.href} href={l.href} onClick={e => scrollTo(e, l.href)}
            className="no-underline text-lg hover:text-accent transition-colors"
            style={{ color: 'var(--text)' }}>
            {l.label}
          </a>
        ))}
      <a href="#contact" onClick={e => scrollTo(e, '#contact')} className="px-5 py-2 text-sm font-semibold no-underline rounded-full"
  style={{ background: 'var(--accent)', color: 'var(--bg)' }}>
  Hire Me
</a>
      </div>
    </>
  )
}
