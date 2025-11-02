import { useRef, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { MathUtils } from 'three';

interface Props {
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
}

const PipeTile = ({ scale = 4, position = [0, 0, 0], rotation = [0, 0, 0] }: Props) => {
  const groupRef = useRef<THREE.Group>(null);
  const { nodes, materials } = useGLTF('/assets/models/pipe_4.glb'); 
  
  const [isHovered, setIsHovered] = useState(false);
  const currentXRotationRef = useRef(0);
  const targetXRotationRef = useRef(0);
  const holdXTimeRef = useRef(0);
  const isHoldingXRef = useRef(false);
  const prevHoveredXRef = useRef(false);

  // Start flip when tile is hovered
  if (isHovered && !prevHoveredXRef.current) {
    targetXRotationRef.current = -Math.PI + 0.5;
    holdXTimeRef.current = 0;
    isHoldingXRef.current = false;
    prevHoveredXRef.current = true;
  }

  // Animation loop for x-rotation
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const isAtXFlipped = Math.abs(currentXRotationRef.current - (-Math.PI + 0.5)) < 0.01;

    // Start hold timer when flipped
    if (isAtXFlipped && !isHoldingXRef.current) {
      isHoldingXRef.current = true;
      holdXTimeRef.current = 0;
    }
    
    // Increment hold timer
    if (isHoldingXRef.current) {
      holdXTimeRef.current += delta;

      // Return to original rotation after 8s
      if (holdXTimeRef.current >= 8) {
        targetXRotationRef.current = 0;
        isHoldingXRef.current = false;
        prevHoveredXRef.current = false;
      }
    }
    
    const isReturningX = targetXRotationRef.current === 0 && currentXRotationRef.current < 0;
    
    if (isReturningX) {
      // Linear rotation for return
      const returnSpeed = 1.2;
      const rotationStep = returnSpeed * delta;
      currentXRotationRef.current = Math.min(0, currentXRotationRef.current + rotationStep);
    } else {
      // Eased rotation for forward flip
      const forwardSpeed = 6;
      const lerpFactor = 1 - Math.exp(-forwardSpeed * delta);
      currentXRotationRef.current = MathUtils.lerp(
        currentXRotationRef.current,
        targetXRotationRef.current,
        lerpFactor
      );
    }
    
    groupRef.current.rotation.x = currentXRotationRef.current;
    
    // Snap to target when close enough
    if (Math.abs(currentXRotationRef.current - targetXRotationRef.current) < 0.001) {
      currentXRotationRef.current = targetXRotationRef.current;
      groupRef.current.rotation.x = targetXRotationRef.current;
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
                onPointerEnter={(e) => {
                  e.stopPropagation();
                  setIsHovered(true);
                }}
                onPointerLeave={() => setIsHovered(false)}
              />
            );
          })
      }
    </group>
  )
}

useGLTF.preload('/assets/models/pipe_4.glb');

export default PipeTile;