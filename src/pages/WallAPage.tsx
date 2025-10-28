import { Canvas } from '@react-three/fiber';
import WallA from '../components/WallA';

function WallAPage() {
  return (
    <div className="app-container">
      <div className="instructions">
        Use mouse interactions for effects
      </div>
      <Canvas orthographic camera={{ position: [0, 0, 1], zoom: 20, far: 6 }}>
        <WallA />
        <ambientLight intensity={0.5} />
      </Canvas>
    </div>
  );
}

export default WallAPage;