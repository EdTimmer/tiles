import { Suspense, useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Html } from '@react-three/drei';
// import TilesGroup from '../components/TilesGroup';
import HBlocksGroup from '@/components/HBlocksGroup';

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
      <ambientLight intensity={2.5} />
      {/* <directionalLight position={[5, 5, 5]} intensity={0.5} /> */}
      {/* <directionalLight position={[0, 1, 1]} intensity={1.0} color={'yellow'} />
      <directionalLight position={[0, -1, 3]} intensity={1.0} color={'yellow'} />

      <directionalLight position={[0, 1, -3]} intensity={1.0} color={'yellow'} />
      <directionalLight position={[0, -1, -3]} intensity={1.0} color={'yellow'} />

      <directionalLight position={[-2, 0, 3]} intensity={1.0} color={'yellow'} />
      <directionalLight position={[2, 0, 3]} intensity={1.0} color={'yellow'} />

      <directionalLight position={[-2, 0, -3]} intensity={1.0} color={'yellow'} />
      <directionalLight position={[2, 0, -3]} intensity={1.0} color={'yellow'} /> */}

      <HBlocksGroup rows={7} tilesPerRow={17} verticalSpacing={0.375} horizontalOffset={0.38} />
      <Suspense fallback={null}>
        <Environment preset="city" environmentIntensity={2.5} />
      </Suspense>
      {/* <OrbitControls enableZoom={true} enablePan={true} /> */}
    </>
  );
}

function HBlockPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoaded = () => {
    setIsLoaded(true);
  };

  return (
    <div 
      className={isLoaded ? "hblocks-container" : ""}
      style={{ width: '100%', height: '100%' }}
    >
      <Canvas camera={{ position: [0, 0, 10], zoom: 7 }}>
        <Suspense fallback={<Loader />}>
          <SceneContent onReady={handleLoaded} />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default HBlockPage;
