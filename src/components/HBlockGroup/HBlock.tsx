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
  isVertical?: boolean;
}

const HBlock = ({ scale = 4, position = [0, 0, 0], rotation = [0, 0, 0], isVertical = true }: Props) => {
  const groupRef = useRef<THREE.Group>(null);
  const { nodes, materials } = useGLTF(isVertical ? '/assets/models/h-block-gold-v1-4.glb' : '/assets/models/h-block-gold-v2-4.glb'); 
  const currentZPositionRef = useRef(0);
  const targetZPositionRef = useRef(0);
  const holdTimeRef = useRef(0);
  const isHoldingRef = useRef(false);
  const currentYRotationRef = useRef(0);
  const targetYRotationRef = useRef(0);
  const isFlippingRef = useRef(false);

  const handlePointerEnter = (event: any) => {
    event.stopPropagation();
    
    // Prevent interaction during flip animation
    if (isFlippingRef.current) return;
    
    // Start animation: move -2.0 on z-axis
    targetZPositionRef.current = -2.0;
    holdTimeRef.current = 0;
    isHoldingRef.current = false;
    isFlippingRef.current = false;
  };

  

  // Animation loop for z-position and y-rotation
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    
    const isAtTarget = Math.abs(currentZPositionRef.current - (-2.0)) < 0.01;
    
    // Start flip when target position reached
    if (isAtTarget && !isHoldingRef.current) {
      isHoldingRef.current = true;
      holdTimeRef.current = 0;
      isFlippingRef.current = true;
      targetYRotationRef.current += Math.PI;
    }
    
    // Increment hold timer
    if (isHoldingRef.current) {
      holdTimeRef.current += delta;

      // Return to original position after 0.8s
      if (holdTimeRef.current >= 0.8) {
        targetZPositionRef.current = 0;
        isHoldingRef.current = false;
        isFlippingRef.current = false;
      }
    }
    
    // Frame-independent interpolation
    const speed = 3;
    const lerpFactor = 1 - Math.exp(-speed * delta);
    
    // Interpolate z-position
    currentZPositionRef.current = MathUtils.lerp(
      currentZPositionRef.current,
      targetZPositionRef.current,
      lerpFactor
    );
    
    // Interpolate y-rotation
    const rotationSpeed = 3;
    const rotationLerpFactor = 1 - Math.exp(-rotationSpeed * delta);
    currentYRotationRef.current = MathUtils.lerp(
      currentYRotationRef.current,
      targetYRotationRef.current,
      rotationLerpFactor
    );
    
    // Apply rotation using quaternions
    const initialRotationQuaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(rotation[0], rotation[1], rotation[2])
    );
    
    const yRotationQuaternion = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 1, 0),
      currentYRotationRef.current
    );
    
    const finalQuaternion = new THREE.Quaternion()
      .multiplyQuaternions(initialRotationQuaternion, yRotationQuaternion);
    
    groupRef.current.quaternion.copy(finalQuaternion);
    groupRef.current.position.z = position[2] + currentZPositionRef.current;
    
    // Snap to target when close enough
    if (Math.abs(currentZPositionRef.current - targetZPositionRef.current) < 0.001) {
      currentZPositionRef.current = targetZPositionRef.current;
      groupRef.current.position.z = position[2] + targetZPositionRef.current;
    }
    
    if (Math.abs(currentYRotationRef.current - targetYRotationRef.current) < 0.001) {
      currentYRotationRef.current = targetYRotationRef.current;
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

useGLTF.preload('/assets/models/h-block-gold-v1-4.glb');
useGLTF.preload('/assets/models/h-block-gold-v2-4.glb');

export default HBlock;