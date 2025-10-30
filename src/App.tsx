import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'
import Navigation from './components/Navigation';
import HexTilePage from './pages/HexTilePage';
// import WallAPage from './pages/WallAPage';
import WallBPage from './pages/WallBPage';
import WallCPage from './pages/WallCPage';
import HBlockPage from './pages/HBlockPage';
import ValveTilePage from './pages/ValveTilePage';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navigation />
        
        <Routes>
          <Route path="/" element={<Navigate to="/hex-tiles" replace />} />
          <Route path="/hex-tiles" element={<HexTilePage />} />
          <Route path="/h-blocks" element={<HBlockPage />} />
          <Route path="/wall-b" element={<ValveTilePage />} />
          <Route path="/wall-c" element={<WallCPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
