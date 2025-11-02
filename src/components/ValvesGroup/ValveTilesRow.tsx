import { useState } from 'react';
import ValveTile from './ValveTile';

interface Props {
  position?: [number, number, number];
  count?: number;
  spacing?: number;
}

const ValveTilesRow = ({ position = [0, 0, 0], count = 5, spacing = 0.65 }: Props) => {
  const [isRowHovered, setIsRowHovered] = useState(false);
  
  const handleRowHover = () => {
    setIsRowHovered(true);
  };

  const handleRowLeave = () => {
    setIsRowHovered(false);
  };
  
  const generateTiles = () => {
    const tiles = [];
    // Calculate offset to center the tiles
    const offset = ((count - 1) * spacing) / 2;
    
    for (let i = 0; i < count; i++) {
      const xPosition = position[0] + (i * spacing) - offset;
      tiles.push(
        <ValveTile
          key={i} 
          position={[xPosition, position[1], position[2]]} 
          scale={0.356}
          isRowHovered={isRowHovered}
          onRowHover={handleRowHover}
        />
      );
    }
    return tiles;
  };

  return (
    <group onPointerLeave={handleRowLeave}>
      {generateTiles()}
    </group>
  );
};

export default ValveTilesRow;
