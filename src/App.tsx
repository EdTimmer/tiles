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
          <Route path="/" element={<Navigate to="/hexagons" replace />} />
          <Route path="/hexagons" element={<HexTilePage />} />          
          <Route path="/valves" element={<ValveTilePage />} />
          <Route path="/pipes" element={<PipesPage />} />
          <Route path="/kamon" element={<HBlockPage />} />
          {/* Catch-all route for invalid paths */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <div className="link-container">
          <a href="https://www.edtimmer.com/" target="_blank" aria-label="Link to portfolio" title="Link to portfolio">edtimmer.com</a>
        </div>
      </div>
    </Router>
  )
}

export default App
