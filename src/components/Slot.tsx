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
  isRowHovered?: boolean;
  onRowHover?: () => void;
}

const Slot = ({ scale = 4, position = [0, 0, 0], rotation = [0, 0, 0], isRowHovered = false, onRowHover }: Props) => {
  const groupRef = useRef<THREE.Group>(null);
  const { nodes, materials } = useGLTF('/assets/models/slot.glb'); 
  const currentRotationRef = useRef(0);
  const targetRotationRef = useRef(0);
  const holdTimeRef = useRef(0);
  const isHoldingRef = useRef(false);

  // Update target rotation based on row hover state
  const prevHoveredRef = useRef(false);
  
  if (isRowHovered && !prevHoveredRef.current) {
    // Start flip animation when row is hovered
    targetRotationRef.current = Math.PI / 2;
    holdTimeRef.current = 0;
    isHoldingRef.current = false;
    prevHoveredRef.current = true;
  }

  // Continuous rotation using useFrame
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const isAtFlipped = Math.abs(currentRotationRef.current - Math.PI / 2) < 0.01;

    // If we've reached flipped position, start holding timer
    if (isAtFlipped && !isHoldingRef.current) {
      isHoldingRef.current = true;
      holdTimeRef.current = 0;
    }
    
    // If holding, increment timer
    if (isHoldingRef.current) {
      holdTimeRef.current += delta;

      // After 10 seconds, rotate back
      if (holdTimeRef.current >= 4) {
        targetRotationRef.current = 0;
        isHoldingRef.current = false;
        prevHoveredRef.current = false;
      }
    }
    
    // Incorporate delta into the interpolation factor for frame rate independence
    // Use different speeds for forward flip vs return rotation
    const isReturning = targetRotationRef.current === 0 && currentRotationRef.current > 0;
    
    if (isReturning) {
      // Linear rotation for return - no easing
      const returnSpeed = 1; // Radians per second for return rotation
      const rotationStep = returnSpeed * delta;
      currentRotationRef.current = Math.max(0, currentRotationRef.current - rotationStep);
    } else {
      // Eased rotation for forward flip
      const forwardSpeed = 10;
      const lerpFactor = 1 - Math.exp(-forwardSpeed * delta);
      currentRotationRef.current = MathUtils.lerp(
        currentRotationRef.current,
        targetRotationRef.current,
        lerpFactor
      );
    }
    
    groupRef.current.rotation.y = currentRotationRef.current;
    
    // Snap to target if very close
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
                onPointerEnter={onRowHover}
              />
            );
          })
      }
    </group>
  )
}

// Preload the GLTF model
useGLTF.preload('/assets/models/valve_8.glb');

export default Slot;