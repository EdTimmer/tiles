import { useRef, useState } from 'react';
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

const PipeTile = ({ scale = 4, position = [0, 0, 0], rotation = [0, 0, 0] }: Props) => {
  const groupRef = useRef<THREE.Group>(null);
  const { nodes, materials } = useGLTF('/assets/models/pipe_3.glb'); 
  
  // Local hover state for individual tile
  const [isHovered, setIsHovered] = useState(false);
  const currentXRotationRef = useRef(0);
  const targetXRotationRef = useRef(0);
  const holdXTimeRef = useRef(0);
  const isHoldingXRef = useRef(false);
  const prevHoveredXRef = useRef(false);

  // Update target x rotation based on individual hover state
  if (isHovered && !prevHoveredXRef.current) {
    // Start flip animation when tile is hovered
    targetXRotationRef.current = -Math.PI; // -180 degrees
    holdXTimeRef.current = 0;
    isHoldingXRef.current = false;
    prevHoveredXRef.current = true;
  }

  // Continuous rotation using useFrame
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Handle X-axis rotation (individual tile hover)
    const isAtXFlipped = Math.abs(currentXRotationRef.current - (-Math.PI)) < 0.01;

    // If we've reached flipped position on x-axis, start holding timer
    if (isAtXFlipped && !isHoldingXRef.current) {
      isHoldingXRef.current = true;
      holdXTimeRef.current = 0;
    }
    
    // If holding on x-axis, increment timer
    if (isHoldingXRef.current) {
      holdXTimeRef.current += delta;

      // After 2 seconds, rotate back
      if (holdXTimeRef.current >= 8) {
        targetXRotationRef.current = 0;
        isHoldingXRef.current = false;
        prevHoveredXRef.current = false;
      }
    }
    
    // Animate x-axis rotation
    const isReturningX = targetXRotationRef.current === 0 && currentXRotationRef.current < 0;
    
    if (isReturningX) {
      // Linear rotation for return
      const returnSpeed = 1.2; // Radians per second for return rotation
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
    
    // Snap to target if very close
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

// Preload the GLTF model
useGLTF.preload('/assets/models/valve_8.glb');

export default PipeTile;