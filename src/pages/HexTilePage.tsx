import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Loader, useProgress } from '@react-three/drei';
import HexGroup from '../components/HexGroup';

function SceneContent() {
  return (
    <>
      <ambientLight intensity={2.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <HexGroup rows={9} tilesPerRow={15} verticalSpacing={0.565} horizontalOffset={0.325} />
      <Environment preset="city" />
    </>
  );
}

function ProgressTracker({ onLoaded }: { onLoaded: () => void }) {
  const { progress } = useProgress();
  
  if (progress === 100) {
    onLoaded();
  }
  
  return null;
}

function HexTilePage() {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoaded = () => {
    if (!isLoaded) {
      setIsLoaded(true);
    }
  };

  return (
    <>
      <div 
        className={isLoaded ? "tiles-container" : ""}
        style={{ 
          width: '100%', 
          height: '100%',
          backgroundColor: 'black'
        }}
      >
        <Canvas camera={{ position: [0, 0, 10], zoom: 4.5 }}>
          <Suspense fallback={null}>
            <SceneContent />
            <ProgressTracker onLoaded={handleLoaded} />
          </Suspense>
        </Canvas>
      </div>
      <Loader />
    </>
  );
}

export default HexTilePage;