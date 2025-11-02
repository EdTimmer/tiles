import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import Navigation from './components/Navigation';
import HexTilePage from './pages/HexTilePage';
import HBlockPage from './pages/HBlockPage';
import ValveTilePage from './pages/ValveTilePage';
import PipesPage from './pages/PipesPage';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navigation />
        
        <Routes>
          <Route path="/" element={<Navigate to="/hex-tiles" replace />} />
          <Route path="/hex-tiles" element={<HexTilePage />} />          
          <Route path="/valve-tiles" element={<ValveTilePage />} />
          <Route path="/pipe-tiles" element={<PipesPage />} />
          <Route path="/h-blocks" element={<HBlockPage />} />
        </Routes>

        <div className="link-container">
          <a href="https://www.edtimmer.com/" target="_blank" aria-label="Link to portfolio" title="Link to portfolio">edtimmer.com</a>
        </div>
      </div>
    </Router>
  )
}

export default App
