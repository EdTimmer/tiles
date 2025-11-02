import HBlock from './HBlock';

interface Props {
  position?: [number, number, number];
  count?: number;
  spacing?: number;
}

const HBlocksRow = ({ position = [0, 0, 0], count = 5, spacing = 0.38 }: Props) => {
  
  const generateTiles = () => {
    const tiles = [];
    // Calculate offset to center the tiles
    const offset = ((count - 1) * spacing) / 2;
    
    for (let i = 0; i < count; i++) {
      const xPosition = position[0] + (i * spacing) - offset;
      // Rotate every other odd index block 90 degrees around z-axis
      const rotation: [number, number, number] = (i % 2 === 1) ? [0, 0, Math.PI / 2] : [0, 0, 0];
      tiles.push(
        <HBlock
          key={i} 
          position={[xPosition, position[1], position[2]]} 
          rotation={rotation}
          scale={0.356}
          isVertical={i % 2 === 0}
        />
      );
    }
    return tiles;
  };

  return (
    <group>
      {generateTiles()}
    </group>
  );
};

export default HBlocksRow;
