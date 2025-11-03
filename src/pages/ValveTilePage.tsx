import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Loader, useProgress } from '@react-three/drei';
import ValvesGroup from '@/components/ValvesGroup';

function SceneContent() {
  return (
    <>
      <ValvesGroup rows={9} tilesPerRow={16} verticalSpacing={0.725} horizontalOffset={0.364} scale={[1.0, 1.0, 1.0]} />
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

function ValveTilePage() {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoaded = () => {
    if (!isLoaded) {
      setIsLoaded(true);
    }
  };

  return (
    <>
      <div 
        className={isLoaded ? "valves-container" : ""}
        style={{ 
          width: '100%', 
          height: '100%',
          backgroundColor: 'black'
        }}
      >
        <Canvas orthographic camera={{ position: [0, 0, 10], zoom: 320.5 }}>
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

export default ValveTilePage;