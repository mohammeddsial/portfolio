import { useState, useRef } from 'react'

// ─── CORS proxies (tries in order, first success wins) ───────────────────────
const PROXIES = [
  url => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  url => `https://corsproxy.io/?${encodeURIComponent(url)}`,
]

async function fetchHTML(url) {
  for (const proxy of PROXIES) {
    try {
      const res = await fetch(proxy(url), {
        headers: { Accept: 'text/html,application/xhtml+xml' },
        signal: AbortSignal.timeout(10000),
      })
      if (res.ok) {
        const text = await res.text()
        if (text && text.length > 500) return text
      }
    } catch { /* try next proxy */ }
  }
  throw new Error('All proxies failed — site may block crawlers.')
}

// ─── HTML parser ─────────────────────────────────────────────────────────────
function parseSite(html, url) {
  const doc = new DOMParser().parseFromString(html, 'text/html')

  const get = (sel, attr = 'content') => {
    const el = doc.querySelector(sel)
    return el ? (attr === 'text' ? el.textContent?.trim() : el.getAttribute(attr) || '') : ''
  }

  const host   = (() => { try { return new URL(url).hostname.replace('www.', '') } catch { return url } })()
  const title  = get('meta[property="og:title"]') || get('title', 'text') || host
  const desc   = get('meta[property="og:description"]') || get('meta[name="description"]') || ''
  const image  = get('meta[property="og:image"]') || ''
  const theme  = get('meta[name="theme-color"]') || ''
  const h1     = doc.querySelector('h1')?.textContent?.trim() || ''
  const h2s    = [...doc.querySelectorAll('h2')].slice(0, 6).map(e => e.textContent?.trim()).filter(t => t?.length < 120)
  const paras  = [...doc.querySelectorAll('p')].slice(0, 10).map(e => e.textContent?.trim()).filter(t => t?.length > 40 && t?.length < 400)
  const links  = [...doc.querySelectorAll('a[href]')].map(a => a.href)

  // ── Tech detection ──────────────────────────────────────────────────────────
  const detectors = [
    ['Webflow',       /webflow|w-nav|w-dyn|\.webflow\.io/i],
    ['WordPress',     /wp-content|wp-includes|wp-json|wordpress/i],
    ['React',         /react-dom|__NEXT_DATA__|data-reactroot/i],
    ['Next.js',       /__NEXT_DATA__|\/_next\//i],
    ['Tailwind CSS',  /tailwind/i],
    ['GSAP',          /gsap|TweenMax|ScrollTrigger/i],
    ['Elementor',     /elementor/i],
    ['Shopify',       /cdn\.shopify|shopify/i],
    ['Framer',        /framerusercontent|\.framer\./i],
    ['jQuery',        /jquery/i],
    ['Finsweet',      /finsweet/i],
    ['Stripe',        /js\.stripe\.com/i],
    ['Mapbox',        /mapbox/i],
  ]
  if (/[\u0600-\u06FF]/.test(html)) detectors.push(['Arabic RTL', null])

  const tech = detectors
    .filter(([, re]) => re == null || re.test(html))
    .map(([name]) => name)

  // ── Category ────────────────────────────────────────────────────────────────
  const bag = (title + ' ' + desc + ' ' + h1 + ' ' + h2s.join(' ')).toLowerCase()
  const cat =
    /exchange|remittance|forex|banking|wps|fintech/i.test(bag)  ? 'Finance & Fintech' :
    /legal|law|compliance|attorney/i.test(bag)                   ? 'Legal & Compliance' :
    /health|clinic|medical|patient|nurse/i.test(bag)             ? 'Healthcare' :
    /hire|recruitment|staffing|talent|hr/i.test(bag)             ? 'HR & Staffing' :
    /education|school|university|course|admiss/i.test(bag)       ? 'Education' :
    /shop|store|cart|product|e-commerce/i.test(bag)              ? 'E-Commerce' :
    /government|ministry|municipality|portal|مجلس/i.test(bag)   ? 'Government & Public Sector' :
    /data|analytics|dashboard|visuali/i.test(bag)                ? 'Data & Analytics' :
    /saas|platform|software|app/i.test(bag)                      ? 'SaaS Platform' :
    tech.includes('Webflow')                                      ? 'Marketing Site' :
    tech.includes('WordPress')                                    ? 'Content & CMS' :
                                                                    'Web Application'

  // ── Accent colour ───────────────────────────────────────────────────────────
  const palette = ['#e8c87a','#5ba4f5','#7de2c4','#e87a7a','#c084fc','#f97316','#10b981']
  let accent = theme && /^#[0-9a-f]{6}$/i.test(theme) ? theme : null
  if (!accent) {
    const found = html.match(/#([0-9a-f]{6})\b/gi)?.filter(c =>
      !['#ffffff','#000000','#111111','#0a0a0a','#f5f5f5','#cccccc'].includes(c.toLowerCase())
    )
    accent = found?.[Math.floor((found.length || 0) / 2)] || null
  }
  if (!accent) {
    let hash = 0; for (const c of host) hash = (hash * 31 + c.charCodeAt(0)) | 0
    accent = palette[Math.abs(hash) % palette.length]
  }

  return { host, title: title.replace(/\s*[|–-].*$/, '').trim(), desc, image, h1, h2s, paras, tech, cat, accent }
}

// ─── Case study template ─────────────────────────────────────────────────────
function buildCaseStudy(meta, url) {
  const primary  = meta.tech.filter(t => ['Webflow','WordPress','React','Next.js','Tailwind CSS','Framer','Shopify'].includes(t))
  const stack    = meta.tech.slice(0, 8)
  const p1       = meta.paras[0] || meta.desc || `${meta.title} delivers a purpose-built digital experience at ${meta.host}.`
  const p2       = meta.paras[1] || ''
  const headings = meta.h2s.slice(0, 3).map(h => `"${h}"`).join(', ')

  const problem = `${meta.title} needed a digital presence that clearly communicates their ${meta.cat.toLowerCase()} proposition, works flawlessly across devices, and scales with business growth. The brief required a solid information architecture, strong brand cohesion, and a build their team could maintain without developer dependency.`

  const solution = [
    primary.length ? `Delivered a ${primary[0]} build with a clean, component-driven approach.` : 'Built on a modern stack with a clean, component-driven approach.',
    headings ? `Key content sections included ${headings}.` : '',
    meta.tech.includes('Arabic RTL') ? 'Full bilingual Arabic/English RTL layout was implemented, including reversed navigation, typography, and mirrored UI patterns.' : '',
    meta.tech.includes('GSAP') ? 'Scroll-driven GSAP animations added motion at key moments without impacting Core Web Vitals.' : '',
    meta.tech.includes('Finsweet') ? 'Finsweet CMS filters power dynamic content discovery without custom JS.' : '',
    p2 ? p2.substring(0, 200) + (p2.length > 200 ? '…' : '') : '',
  ].filter(Boolean).join(' ')

  const outcome = `A live, production-ready site at ${meta.host} that positions ${meta.title} with clarity and confidence in the ${meta.cat.toLowerCase()} space — built with the right stack for long-term maintainability.`

  return {
    // caseStudies.js shape
    num:     String(Date.now()).slice(-4),
    company: meta.title,
    desc:    meta.desc ? meta.desc.substring(0, 120) + (meta.desc.length > 120 ? '…' : '') : `${meta.cat} digital experience — ${meta.host}`,
    tags:    [meta.cat, primary[0] || 'Web Development', meta.host.includes('.ae') || meta.host.includes('.com') ? 'Live Site' : 'In Progress'],
    challenge: [
      problem.split('. ').slice(0, 2).join('. ') + '.',
      `Multi-device performance and accessibility were non-negotiable constraints for the ${meta.cat.toLowerCase()} audience.`,
      meta.tech.includes('Arabic RTL') ? 'Full Arabic/English bilingual support was required, including proper RTL layout, mirrored navigation, and Arabic typography.' : `Brand clarity and conversion flow had to work across all entry points — SEO, paid, and direct.`,
    ],
    solution: [
      solution.split('. ').slice(0, 2).join('. ') + '.',
      stack.length > 2 ? `Tech stack: ${stack.slice(0, 5).join(', ')}.` : '',
      `Component architecture was designed for future extensibility — new sections can be added without rebuilding core layouts.`,
    ].filter(Boolean),
    outcome: [
      outcome,
      `Performance-first build with clean markup, semantic HTML, and optimised assets for fast LCP.`,
      `Client team can manage content independently through the ${primary[0] || 'CMS'} editor.`,
    ],
    metrics: [
      ['Live', 'Production Site'],
      [stack.length + '+', 'Technologies'],
      [meta.cat.split(' ')[0], 'Sector'],
    ],
    link:      url,
    linkLabel: `→ ${meta.host}`,
    // extra fields for the save payload
    _host:   meta.host,
    _tech:   stack,
    _accent: meta.accent,
    _image:  meta.image,
    _url:    url,
  }
}

// ─── Save to caseStudies.js via Vite CMS plugin ──────────────────────────────
async function saveCaseStudy(cs) {
  const payload = {
    num:       cs.num,
    company:   cs.company,
    desc:      cs.desc,
    tags:      cs.tags,
    challenge: cs.challenge,
    solution:  cs.solution,
    outcome:   cs.outcome,
    metrics:   cs.metrics,
    link:      cs.link,
    linkLabel: cs.linkLabel,
  }
  const res = await fetch('/api/save-case-study', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  })
  const data = await res.json()
  return data.success
}

// ─── Colour helpers ───────────────────────────────────────────────────────────
const bg = 'var(--bg)'
const surface = 'var(--surface)'
const card = 'var(--card)'
const text = 'var(--text)'
const muted = 'var(--muted)'
const accent = 'var(--accent)'
const border = '1px solid rgba(255,255,255,0.08)'
const mono = "'JetBrains Mono', monospace"
const serif = "'DM Serif Display', Georgia, serif"

// ─── Component: StatusLine ────────────────────────────────────────────────────
function StatusLine({ lines }) {
  return (
    <div style={{ marginTop: 16, background: 'rgba(0,0,0,0.3)', border, borderRadius: 8, padding: '12px 14px', fontFamily: mono, fontSize: 11 }}>
      {lines.map((l, i) => (
        <div key={i} style={{ color: l.startsWith('✓') ? '#7de2c4' : l.startsWith('✗') ? '#e87a7a' : '#94a3b8', marginBottom: i < lines.length - 1 ? 4 : 0 }}>
          {l}
        </div>
      ))}
    </div>
  )
}

// ─── Component: MetricPill ────────────────────────────────────────────────────
function Metric({ val, label }) {
  return (
    <div style={{ textAlign: 'center', minWidth: 80 }}>
      <div style={{ fontFamily: serif, fontSize: 20, color: accent }}>{val}</div>
      <div style={{ fontFamily: mono, fontSize: 10, color: muted, textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>{label}</div>
    </div>
  )
}

// ─── Component: ColSection ───────────────────────────────────────────────────
function Col({ label, dot, items }) {
  return (
    <div style={{ flex: 1, padding: '18px 20px', borderRight: border }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, fontFamily: mono, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: text }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: dot, flexShrink: 0 }} />
        {label}
      </div>
      <ul style={{ margin: 0, paddingLeft: 14, color: muted, fontSize: 13, lineHeight: 1.65 }}>
        {items.filter(Boolean).map((item, i) => <li key={i} style={{ marginBottom: 4 }}>{item}</li>)}
      </ul>
    </div>
  )
}

// ─── Main Studio component ────────────────────────────────────────────────────
export default function Studio() {
  const [url, setUrl] = useState('')
  const [phase, setPhase] = useState('idle') // idle | loading | done | error
  const [lines, setLines] = useState([])
  const [cs, setCs] = useState(null)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const inputRef = useRef(null)

  const log = (msg) => setLines(prev => [...prev, msg])

  const SAMPLES = [
    'https://alghurairexchange.com',
    'https://edaratgroup.com',
    'https://yardathletics.ca',
    'https://dtec.ae',
    'https://jukeaudio.com',
  ]

  const run = async (target) => {
    const rawUrl = (target || url).trim()
    if (!rawUrl) return
    const fullUrl = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`

    setPhase('loading')
    setLines([])
    setCs(null)
    setSaved(false)

    try {
      log(`→ Fetching ${fullUrl}`)
      const html = await fetchHTML(fullUrl)
      log(`✓ Got ${(html.length / 1024).toFixed(0)}kb`)

      log(`→ Parsing HTML`)
      const meta = parseSite(html, fullUrl)
      log(`✓ ${meta.title} · ${meta.cat}`)
      log(`✓ Stack: ${meta.tech.slice(0, 5).join(', ') || 'custom'}`)

      log(`→ Building case study`)
      const study = buildCaseStudy(meta, fullUrl)
      log(`✓ Done`)

      setCs(study)
      setPhase('done')
    } catch (err) {
      log(`✗ ${err.message}`)
      setPhase('error')
    }
  }

  const handleSave = async () => {
    if (!cs) return
    setSaving(true)
    try {
      const ok = await saveCaseStudy(cs)
      setSaved(ok)
      if (!ok) alert('Saved in memory only — Vite dev server required to write caseStudies.js')
    } catch {
      alert('Save failed — make sure Vite dev server is running (npm run dev)')
    }
    setSaving(false)
  }

  const handleCopy = () => {
    if (!cs) return
    const code = `  {
    num: '${cs.num}',
    company: '${cs.company}',
    desc: '${cs.desc.replace(/'/g, "\\'")}',
    tags: [${cs.tags.map(t => `'${t}'`).join(', ')}],
    challenge: [
${cs.challenge.filter(Boolean).map(c => `      '${c.replace(/'/g, "\\'")}'`).join(',\n')}
    ],
    solution: [
${cs.solution.filter(Boolean).map(s => `      '${s.replace(/'/g, "\\'")}'`).join(',\n')}
    ],
    outcome: [
${cs.outcome.map(o => `      '${o.replace(/'/g, "\\'")}'`).join(',\n')}
    ],
    metrics: [${cs.metrics.map(([v, l]) => `['${v}','${l}']`).join(', ')}],
    link: '${cs.link}',
    linkLabel: '${cs.linkLabel}',
  },`
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div style={{ minHeight: '100vh', background: bg, color: text, fontFamily: "'DM Sans', system-ui, sans-serif" }}>

      {/* ── NAV ── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(9,13,19,0.85)', backdropFilter: 'blur(20px)', borderBottom: border, padding: '16px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <a href="/" style={{ color: muted, textDecoration: 'none', fontFamily: mono, fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>← shersial.com</a>
          <span style={{ color: 'rgba(255,255,255,0.15)' }}>/</span>
          <span style={{ fontFamily: mono, fontSize: 12, color: accent }}>studio</span>
        </div>
        <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 15, color: text, letterSpacing: '-0.02em' }}>
          Case Study <em style={{ color: accent, fontStyle: 'normal' }}>Studio</em>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '72px 32px 48px' }}>
        <div style={{ fontFamily: mono, fontSize: 11, color: 'rgba(232,200,122,0.7)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 20 }}>
          Zahid Sher Sial · 2026
        </div>
        <h1 style={{ fontFamily: serif, fontSize: 'clamp(40px,7vw,80px)', fontWeight: 400, lineHeight: 0.95, letterSpacing: '-0.02em', margin: '0 0 24px', color: text }}>
          Paste a URL.<br />
          <em style={{ color: accent, fontStyle: 'normal' }}>Get a case study.</em>
        </h1>
        <p style={{ fontSize: 16, color: muted, maxWidth: 560, lineHeight: 1.6, margin: '0 0 48px' }}>
          Drop any project URL — a live site, a staging environment, or a client domain.
          The studio reads the page, detects the tech stack, and builds a formatted case study
          ready to drop into your portfolio with one click.
        </p>

        {/* ── URL INPUT ── */}
        <div style={{ background: surface, border, borderRadius: 14, padding: 24, marginBottom: 24, position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 1, background: `linear-gradient(90deg, transparent, ${accent}, transparent)`, opacity: 0.4 }} />

          <label style={{ fontFamily: mono, fontSize: 11, color: muted, textTransform: 'uppercase', letterSpacing: '0.12em', display: 'block', marginBottom: 10 }}>
            Project URL
          </label>

          <div style={{ display: 'flex', gap: 10 }}>
            <input
              ref={inputRef}
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && run()}
              placeholder="https://client-site.com"
              style={{
                flex: 1, background: bg, border, borderRadius: 9, padding: '13px 16px',
                fontFamily: mono, fontSize: 14, color: text, outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = accent}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
            />
            <button
              onClick={() => run()}
              disabled={phase === 'loading'}
              style={{
                padding: '13px 28px', background: phase === 'loading' ? 'rgba(232,200,122,0.1)' : accent,
                color: phase === 'loading' ? accent : '#090d13',
                border: 'none', borderRadius: 9, fontFamily: "'DM Sans', sans-serif",
                fontSize: 14, fontWeight: 600, cursor: phase === 'loading' ? 'wait' : 'pointer',
                transition: 'all 0.15s', flexShrink: 0,
              }}
            >
              {phase === 'loading' ? 'Reading…' : 'Read site →'}
            </button>
          </div>

          <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontFamily: mono, fontSize: 10, color: muted }}>Try:</span>
            {SAMPLES.map(s => (
              <button
                key={s}
                onClick={() => { setUrl(s); run(s) }}
                style={{
                  padding: '4px 10px', background: 'rgba(255,255,255,0.04)', border,
                  borderRadius: 20, fontFamily: mono, fontSize: 10, color: muted,
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.target.style.borderColor = accent; e.target.style.color = accent }}
                onMouseLeave={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.color = muted }}
              >
                {s.replace('https://', '')}
              </button>
            ))}
          </div>

          {lines.length > 0 && <StatusLine lines={lines} />}
        </div>

        {/* ── CASE STUDY OUTPUT ── */}
        {cs && phase === 'done' && (
          <div style={{ animation: 'fadeUp 0.4s ease-out' }}>

            {/* Action bar */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
              <button
                onClick={handleSave}
                disabled={saving || saved}
                style={{
                  padding: '10px 20px', background: saved ? 'rgba(125,226,196,0.15)' : 'rgba(232,200,122,0.12)',
                  color: saved ? '#7de2c4' : accent,
                  border: `1px solid ${saved ? 'rgba(125,226,196,0.3)' : 'rgba(232,200,122,0.25)'}`,
                  borderRadius: 8, fontFamily: mono, fontSize: 12, cursor: saving || saved ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {saved ? '✓ Saved to caseStudies.js' : saving ? 'Saving…' : '⬡ Save to caseStudies.js'}
              </button>
              <button
                onClick={handleCopy}
                style={{
                  padding: '10px 20px', background: copied ? 'rgba(125,226,196,0.1)' : 'rgba(255,255,255,0.04)',
                  color: copied ? '#7de2c4' : muted,
                  border, borderRadius: 8, fontFamily: mono, fontSize: 12, cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {copied ? '✓ Copied!' : '⎘ Copy code'}
              </button>
              <button
                onClick={() => { setPhase('idle'); setCs(null); setLines([]); setUrl('') }}
                style={{
                  padding: '10px 20px', background: 'transparent', color: muted,
                  border, borderRadius: 8, fontFamily: mono, fontSize: 12, cursor: 'pointer',
                }}
              >
                ↻ New project
              </button>
            </div>

            {/* ── CASE STUDY CARD ── matches CaseStudies.jsx exactly ── */}
            <div className="cs-card" style={{ overflow: 'hidden', borderRadius: 16 }}>

              {/* Cover */}
              <div style={{
                minHeight: 200, background: cs._image
                  ? `linear-gradient(180deg, ${cs._accent}55 0%, rgba(9,13,19,0.95) 100%), url(${cs._image}) center/cover`
                  : `linear-gradient(135deg, ${cs._accent}33 0%, ${cs._accent}11 100%)`,
                padding: '40px 40px 32px',
                display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
              }}>
                <div style={{ fontFamily: mono, fontSize: 12, color: accent, marginBottom: 6 }}>
                  CASE STUDY · {cs.num}
                </div>
                <div style={{ fontFamily: serif, fontSize: 'clamp(28px,5vw,48px)', lineHeight: 1.1, marginBottom: 10 }}>
                  {cs.company}
                </div>
                <div style={{ fontSize: 15, color: muted, maxWidth: 560 }}>{cs.desc}</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 14, flexWrap: 'wrap' }}>
                  {cs.tags.map(t => (
                    <span key={t} style={{ fontFamily: mono, fontSize: 10, padding: '4px 12px', borderRadius: 99, background: 'rgba(232,200,122,0.1)', color: accent, border: '1px solid rgba(232,200,122,0.2)' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Three columns */}
              <div style={{ borderTop: border, display: 'flex', flexWrap: 'wrap' }}>
                <Col label="Challenge" dot="var(--dot-challenge, #e87a7a)" items={cs.challenge} />
                <Col label="Solution"  dot="#5ba4f5" items={cs.solution} />
                <div style={{ flex: 1, padding: '18px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, fontFamily: mono, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: text }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#7de2c4', flexShrink: 0 }} />
                    Outcome
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 14, color: muted, fontSize: 13, lineHeight: 1.65 }}>
                    {cs.outcome.map((o, i) => <li key={i} style={{ marginBottom: 4 }}>{o}</li>)}
                  </ul>
                </div>
              </div>

              {/* Footer */}
              <div style={{ borderTop: border, background: 'rgba(255,255,255,0.03)', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                  {cs.metrics.map(([val, label]) => <Metric key={label} val={val} label={label} />)}
                </div>
                <a href={cs.link} target="_blank" rel="noreferrer" style={{ fontFamily: mono, fontSize: 13, color: accent, textDecoration: 'none' }}>
                  {cs.linkLabel}
                </a>
              </div>

              {/* Stack chips (extra info) */}
              <div style={{ borderTop: border, padding: '14px 24px', display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontFamily: mono, fontSize: 10, color: muted, marginRight: 4 }}>Detected stack:</span>
                {cs._tech.map(t => (
                  <span key={t} style={{ fontFamily: mono, fontSize: 10, padding: '3px 9px', borderRadius: 4, background: 'rgba(255,255,255,0.04)', border, color: muted }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ── HOW IT WORKS ── */}
        {phase === 'idle' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginTop: 48 }}>
            {[
              ['01', 'Paste URL', "Any live site — client projects, staging environments, or domains you've built."],
              ['02', 'Reads the page', "Fetches HTML via CORS proxy, parses OG tags, headings, body text, and detects tech stack."],
              ['03', 'Builds case study', "Generates challenge, solution, outcome, and metrics using your real project data."],
              ['04', 'Saves to site', "One click writes to caseStudies.js via the Vite plugin — visible on your portfolio instantly."],
            ].map(([num, title, desc]) => (
              <div key={num} style={{ background: surface, border, borderRadius: 12, padding: 20 }}>
                <div style={{ fontFamily: mono, fontSize: 11, color: accent, marginBottom: 8 }}>{num}</div>
                <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 6, color: text }}>{title}</div>
                <div style={{ fontSize: 12, color: muted, lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        input::placeholder { color: rgba(148,163,184,0.5); }
      `}</style>
    </div>
  )
}