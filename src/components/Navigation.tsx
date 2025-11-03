import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="buttons-container">
      <Link 
        to="/hexagons" 
        className="button" 
        style={{ 
          border: isActive('/hex-tiles') ? '1px solid white' : '1px solid transparent',
        }}
      >
        Hexagons
      </Link>

      <Link 
        to="/pipes" 
        className="button" 
        style={{ 
          border: isActive('/pipe-tiles') ? '1px solid white' : '1px solid transparent',
        }}
      >
        Pipes
      </Link>

      <Link 
        to="/valves" 
        className="button" 
        style={{ 
          border: isActive('/valve-tiles') ? '1px solid white' : '1px solid transparent',
        }}
      >
        Valves
      </Link>
      
      <Link 
        to="/kamon" 
        className="button" 
        style={{ 
          border: isActive('/h-blocks') ? '1px solid white' : '1px solid transparent',
        }}
      >
        Kamon
      </Link>
    </div>
  );
};

export default Navigation;