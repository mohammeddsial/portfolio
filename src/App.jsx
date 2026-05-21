import { Routes, Route } from 'react-router-dom'
import PortfolioSite from './Portfolio.jsx'
import PortfolioCMS  from './PortfolioCMS.jsx'


export default function App() {
  return (
    <Routes>
      <Route path="/admin"   element={<PortfolioCMS />} />
      
      <Route path="/*"       element={<PortfolioSite />} />
    </Routes>
  )
}