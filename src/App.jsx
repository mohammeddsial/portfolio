import { Routes, Route } from 'react-router-dom'
import PortfolioSite from './Portfolio.jsx'
import PortfolioCMS  from './PortfolioCMS.jsx'
import JobScanner    from './pages/scanner.jsx'
import Studio        from './pages/Studio.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/admin"   element={<PortfolioCMS />} />
      <Route path="/scanner" element={<JobScanner />} />
      <Route path="/studio"  element={<Studio />} />
      <Route path="/*"       element={<PortfolioSite />} />
    </Routes>
  )
}