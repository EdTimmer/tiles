import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Loader, useProgress } from '@react-three/drei';
import PipesGroup from '@/components/PipesGroup';

function SceneContent() {
  return (
    <>
      <PipesGroup rows={9} tilesPerRow={17} verticalSpacing={0.8} horizontalOffset={0.364} scale={[1.0, 1.0, 1.0]} />
      <Environment preset="apartment" environmentIntensity={0.5} />
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

function PipesPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoaded = () => {
    if (!isLoaded) {
      setIsLoaded(true);
    }
  };

  return (
    <>
      <div 
        className={isLoaded ? "pipes-container" : ""}
        style={{ 
          width: '100%', 
          height: '100%',
          backgroundColor: 'black'
        }}
      >
        <Canvas camera={{ position: [0, 0, 10], zoom: 4.0, far: 10.0 }}>
          <Suspense fallback={null}>
            <SceneContent />
            <ProgressTracker onLoaded={handleLoaded} />
          </Suspense>
        </Canvas>
      </div>
      <Loader />
    </>
  );
}export default PipesPage;