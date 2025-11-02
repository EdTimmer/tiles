import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Loader, useProgress } from '@react-three/drei';
import HBlocksGroup from '@/components/HBlockGroup';

function SceneContent() {
  const directionalLightIntensity = 0.02;
  
  return (
    <>
      <ambientLight intensity={7} />

      {/* far left column linghts */}
      <directionalLight 
        position={[-0.68, -0.06, 5]}
        intensity={directionalLightIntensity}
        color={'#FFFFFF'}
        castShadow={true}
      />

      <directionalLight 
        position={[-0.68, 0.14, 5]}
        intensity={directionalLightIntensity}
        color={'#FFFFFF'}
        castShadow={true}
      />

      <directionalLight 
        position={[-0.68, -0.24, 5]}
        intensity={directionalLightIntensity}
        color={'#FFFFFF'}
        castShadow={true}
      />

      {/* left column linghts */}
      <directionalLight 
        position={[-0.3, -0.06, 5]}
        intensity={directionalLightIntensity}
        color={'#FFFFFF'}
        castShadow={true}
      />

      <directionalLight 
        position={[-0.3, 0.14, 5]}
        intensity={directionalLightIntensity}
        color={'#FFFFFF'}
        castShadow={true}
      />

      <directionalLight 
        position={[-0.3, -0.24, 5]}
        intensity={directionalLightIntensity}
        color={'#FFFFFF'}
        castShadow={true}
      />

      {/* center column linghts */}
      <directionalLight 
        position={[0.08, -0.06, 5]}
        intensity={directionalLightIntensity}
        color={'#FFFFFF'}
        castShadow={true}
      />

      <directionalLight 
        position={[0.08, 0.14, 5]}
        intensity={directionalLightIntensity}
        color={'#FFFFFF'}
        castShadow={true}
      />

      <directionalLight 
        position={[0.08, -0.24, 5]}
        intensity={directionalLightIntensity}
        color={'#FFFFFF'}
        castShadow={true}
      />

      {/* right column linghts */}
      <directionalLight 
        position={[0.46, -0.06, 5]}
        intensity={directionalLightIntensity}
        color={'#FFFFFF'}
        castShadow={true}
      />

      <directionalLight 
        position={[0.46, 0.14, 5]}
        intensity={directionalLightIntensity}
        color={'#FFFFFF'}
        castShadow={true}
      />

      <directionalLight 
        position={[0.46, -0.24, 5]}
        intensity={directionalLightIntensity}
        color={'#FFFFFF'}
        castShadow={true}
      />

      {/* far right column linghts */}
      <directionalLight 
        position={[0.84, -0.06, 5]}
        intensity={directionalLightIntensity}
        color={'#FFFFFF'}
        castShadow={true}
      />

      <directionalLight 
        position={[0.84, 0.14, 5]}
        intensity={directionalLightIntensity}
        color={'#FFFFFF'}
        castShadow={true}
      />

      <directionalLight 
        position={[0.84, -0.24, 5]}
        intensity={directionalLightIntensity}
        color={'#FFFFFF'}
        castShadow={true}
      />

      <HBlocksGroup rows={5} tilesPerRow={13} verticalSpacing={0.375} horizontalOffset={0.38} />
      <Environment preset="sunset" environmentIntensity={1.0} />
      {/* <OrbitControls enableZoom={true} enablePan={true} /> */}
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

function HBlockPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoaded = () => {
    if (!isLoaded) {
      setIsLoaded(true);
    }
  };

  return (
    <>
      <div 
        className={isLoaded ? "hblocks-container" : ""}
        style={{ 
          width: '100%', 
          height: '100%',
          backgroundColor: 'black'
        }}
      >
        <Canvas camera={{ position: [0, 0, 10], zoom: 12 }}>
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

export default HBlockPage;
