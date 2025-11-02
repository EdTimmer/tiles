import { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MathUtils } from 'three';

interface Props {
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

const HexTile = ({ scale = 4, position = [0, 0, 0], rotation = [0, 0, 0] }: Props) => {
  const groupRef = useRef<THREE.Group>(null);
  const { nodes, materials } = useGLTF('/assets/models/hex_tile_4.glb'); 
  const currentRotationRef = useRef(0);
  const targetRotationRef = useRef(0);
  const holdTimeRef = useRef(0);
  const isHoldingRef = useRef(false);

  const handlePointerEnter = () => {
    targetRotationRef.current = Math.PI;
    holdTimeRef.current = 0;
    isHoldingRef.current = false;
  };

  

  // Animation loop for y-rotation
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    
    const isAtFlipped = Math.abs(currentRotationRef.current - Math.PI) < 0.01;
    
    // Start hold timer when flipped
    if (isAtFlipped && !isHoldingRef.current) {
      isHoldingRef.current = true;
      holdTimeRef.current = 0;
    }
    
    // Increment hold timer
    if (isHoldingRef.current) {
      holdTimeRef.current += delta;

      // Return to original rotation after 2s
      if (holdTimeRef.current >= 2) {
        targetRotationRef.current = 0;
        isHoldingRef.current = false;
      }
    }
    
    // Frame-independent interpolation
    const speed = 3;
    const lerpFactor = 1 - Math.exp(-speed * delta);
    
    currentRotationRef.current = MathUtils.lerp(
      currentRotationRef.current,
      targetRotationRef.current,
      lerpFactor
    );
    
    groupRef.current.rotation.y = currentRotationRef.current;
    
    // Snap to target when close enough
    if (Math.abs(currentRotationRef.current - targetRotationRef.current) < 0.001) {
      currentRotationRef.current = targetRotationRef.current;
      groupRef.current.rotation.y = targetRotationRef.current;
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

useGLTF.preload('/assets/models/hex_tile_4.glb');

export default HexTile;