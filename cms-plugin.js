import fs from 'fs'
import path from 'path'

// ── Existing project formatter (unchanged) ─────────────────────────────────
function formatProject(p) {
  const fields = ['num', 'title', 'url', 'domain', 'desc', 'tags', 'badge']
  const lines = fields
    .filter(k => {
      const v = p[k]
      if (v === undefined || v === null || v === '') return false
      if (Array.isArray(v) && v.length === 0) return false
      return true
    })
    .map(k => {
      const v = p[k]
      let formatted
      if (Array.isArray(v)) {
        formatted = `[${v.map(t => `'${String(t).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`).join(', ')}]`
      } else {
        formatted = `'${String(v).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`
      }
      return `    ${k}: ${formatted}`
    })
  return `  {\n${lines.join(',\n')}\n  }`
}

function buildProjectsFile(data) {
  const cats = ['webflow', 'wordpress', 'react', 'government']
  return cats
    .map(cat => {
      const items = (data[cat] || []).map(formatProject).join(',\n')
      return `export const ${cat}Projects = [\n${items}\n]`
    })
    .join('\n\n') + '\n'
}

// ── Case study formatter ───────────────────────────────────────────────────
function esc(str) {
  return String(str || '')
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
}

function fmtStrArr(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return '[]'
  return `[\n${arr.filter(Boolean).map(s => `      '${esc(s)}'`).join(',\n')}\n    ]`
}

function fmtMetrics(metrics) {
  if (!Array.isArray(metrics)) return '[]'
  return `[${metrics.map(([v, l]) => `['${esc(v)}', '${esc(l)}']`).join(', ')}]`
}

function formatCaseStudy(cs) {
  return `  {
    num: '${esc(cs.num)}',
    company: '${esc(cs.company)}',
    desc: '${esc(cs.desc)}',
    tags: [${(cs.tags || []).map(t => `'${esc(t)}'`).join(', ')}],
    challenge: ${fmtStrArr(cs.challenge)},
    solution: ${fmtStrArr(cs.solution)},
    outcome: ${fmtStrArr(cs.outcome)},
    metrics: ${fmtMetrics(cs.metrics)},
    link: '${esc(cs.link)}',
    linkLabel: '${esc(cs.linkLabel)}',
  }`
}

function readCaseStudies(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    // Extract existing array items with a simple block match
    // We re-parse by evaluating the export (safe — it's our own file)
    const match = content.match(/export const caseStudies\s*=\s*\[([\s\S]*)\]/)
    return match ? match[1].trim() : ''
  } catch {
    return ''
  }
}

function buildCaseStudiesFile(existing, newEntry) {
  const existingTrimmed = existing.trim()
  const items = existingTrimmed
    ? existingTrimmed.endsWith(',')
      ? existingTrimmed + '\n' + newEntry
      : existingTrimmed + ',\n' + newEntry
    : newEntry
  return `export const caseStudies = [\n${items}\n]\n`
}

// ── Plugin ────────────────────────────────────────────────────────────────
export function cmsApiPlugin() {
  return {
    name: 'cms-api',
    configureServer(server) {

      // ── Existing: save projects ──────────────────────────────────────────
      server.middlewares.use('/api/save-projects', (req, res) => {
        if (req.method !== 'POST') { res.writeHead(405); res.end('Method Not Allowed'); return }

        let body = ''
        req.on('data', chunk => { body += chunk.toString() })
        req.on('end', () => {
          try {
            const data = JSON.parse(body)
            const filePath = path.resolve('src/data/projects.js')
            const content = buildProjectsFile(data)
            fs.writeFileSync(filePath, content, 'utf-8')
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ success: true }))
          } catch (err) {
            console.error('[CMS Plugin] save-projects error:', err)
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ success: false, error: String(err) }))
          }
        })
      })

      // ── New: save case study ─────────────────────────────────────────────
      server.middlewares.use('/api/save-case-study', (req, res) => {
        if (req.method !== 'POST') { res.writeHead(405); res.end('Method Not Allowed'); return }

        let body = ''
        req.on('data', chunk => { body += chunk.toString() })
        req.on('end', () => {
          try {
            const cs = JSON.parse(body)
            const filePath = path.resolve('src/data/caseStudies.js')

            // Read existing entries
            const existing = readCaseStudies(filePath)
            const newEntry = formatCaseStudy(cs)
            const content  = buildCaseStudiesFile(existing, newEntry)

            fs.writeFileSync(filePath, content, 'utf-8')
            console.log(`[CMS Plugin] ✓ Case study "${cs.company}" appended to caseStudies.js`)

            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ success: true }))
          } catch (err) {
            console.error('[CMS Plugin] save-case-study error:', err)
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ success: false, error: String(err) }))
          }
        })
      })

    },
  }
}