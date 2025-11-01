import { Suspense, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Html } from '@react-three/drei';
import PipesGroup from '@/components/PipesGroup';

function Loader() {
  return (
    <Html center>
      <div style={{ 
        color: 'white', 
        fontSize: '24px',
        background: 'rgba(0,0,0,0.8)',
        padding: '20px 40px',
        borderRadius: '8px'
      }}>
        Loading...
      </div>
    </Html>
  );
}

function SceneContent({ onReady }: { onReady: () => void }) {
  const readyCalled = useRef(false);
  
  // Call onReady immediately when component mounts
  if (!readyCalled.current) {
    readyCalled.current = true;
    // Use queueMicrotask to defer until after render
    queueMicrotask(() => {
      onReady();
    });
  }
  
  return (
    <>
      {/* <ambientLight intensity={2.5} /> */}
      {/* <directionalLight position={[5, 5, 5]} intensity={1} /> */}
      <PipesGroup rows={9} tilesPerRow={17} verticalSpacing={0.725} horizontalOffset={0.325} scale={[1.0, 1.0, 1.0]} />
      <Suspense fallback={null}>
        <Environment preset="apartment" environmentIntensity={0.5} />
      </Suspense>
    </>
  );
}

function PipesPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoaded = () => {
    setIsLoaded(true);
  };

  return (
    <div 
      className={isLoaded ? "pipes-container" : ""}
      style={{ width: '100%', height: '100%' }}
    >
      <Canvas camera={{ position: [0, 0, 10], zoom: 4.0, far: 10 }}>
        <Suspense fallback={<Loader />}>
          <SceneContent onReady={handleLoaded} />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default PipesPage;