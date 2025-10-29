import { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MathUtils } from 'three';

interface Props {
  children?: React.ReactNode;
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

const HBlock = ({ scale = 4, position = [0, 0, 0], rotation = [0, 0, 0] }: Props) => {
  const groupRef = useRef<THREE.Group>(null);
  const { nodes, materials } = useGLTF('/assets/models/h-block_7.glb'); 
  const currentZPositionRef = useRef(0);
  const targetZPositionRef = useRef(0);
  const holdTimeRef = useRef(0);
  const isHoldingRef = useRef(false);

  const handlePointerEnter = (event: any) => {
    // Prevent event from bubbling and only trigger on the frontmost mesh
    event.stopPropagation();
    
    // Start move animation - move -1.0 on z-axis
    targetZPositionRef.current = -1.0;
    holdTimeRef.current = 0;
    isHoldingRef.current = false;
  };

  

  // Continuous z-axis movement using useFrame
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    
    const isAtTarget = Math.abs(currentZPositionRef.current - (-1.0)) < 0.01;
    
    // If we've reached target position, start holding timer
    if (isAtTarget && !isHoldingRef.current) {
      isHoldingRef.current = true;
      holdTimeRef.current = 0;
    }
    
    // If holding, increment timer
    if (isHoldingRef.current) {
      holdTimeRef.current += delta;

      // After 2 seconds, move back
      if (holdTimeRef.current >= 0.5) {
        targetZPositionRef.current = 0;
        isHoldingRef.current = false;
      }
    }
    
    // Incorporate delta into the interpolation factor for frame rate independence
    const speed = 3; // Adjust this to control the smoothness/speed
    const lerpFactor = 1 - Math.exp(-speed * delta);
    
    // Interpolate the current z position towards the target z position
    currentZPositionRef.current = MathUtils.lerp(
      currentZPositionRef.current,
      targetZPositionRef.current,
      lerpFactor
    );
    
    groupRef.current.position.z = position[2] + currentZPositionRef.current;
    
    // Snap to target if very close
    if (Math.abs(currentZPositionRef.current - targetZPositionRef.current) < 0.001) {
      currentZPositionRef.current = targetZPositionRef.current;
      groupRef.current.position.z = position[2] + targetZPositionRef.current;
    }
  });

  return (
    <group 
      ref={groupRef} 
      position={position} 
      rotation={rotation} 
      scale={scale}
    >
      {
        Object.values(nodes)
          .filter((n) => n instanceof THREE.Mesh)
          .map((mesh) => {
            const originalMaterial = materials[mesh.material.name];
            
            return (
              <mesh
                key={mesh.uuid}
                geometry={mesh.geometry}
                material={originalMaterial}
                onPointerEnter={handlePointerEnter}
              />
            );
          })
      }
    </group>
  )
}

// Preload the GLTF model
useGLTF.preload('/assets/models/hex_tile_4.glb');

export default HBlock;