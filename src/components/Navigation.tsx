import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="buttons-container">
      <Link 
        to="/hex-tiles" 
        className="button" 
        style={{ 
          border: isActive('/hex-tiles') ? '1px solid white' : '1px solid transparent',
        }}
      >
        Hex Tiles
      </Link>
      
      <Link 
        to="/wall-a" 
        className="button" 
        style={{ 
          border: isActive('/wall-a') ? '1px solid white' : '1px solid transparent',
        }}
      >
        Wall A
      </Link>
      
      <Link 
        to="/wall-b" 
        className="button" 
        style={{ 
          border: isActive('/wall-b') ? '1px solid white' : '1px solid transparent',
        }}
      >
        Wall B
      </Link>
      
      <Link 
        to="/wall-c" 
        className="button" 
        style={{ 
          border: isActive('/wall-c') ? '1px solid white' : '1px solid transparent',
        }}
      >
        Wall C
      </Link>
    </div>
  );
};

export default Navigation;