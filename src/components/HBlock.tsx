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
  const { nodes, materials } = useGLTF('/assets/models/h-block_8.glb'); 
  const currentZPositionRef = useRef(0);
  const targetZPositionRef = useRef(0);
  const holdTimeRef = useRef(0);
  const isHoldingRef = useRef(false);
  const currentYRotationRef = useRef(0);
  const targetYRotationRef = useRef(0);
  const isFlippingRef = useRef(false);

  const handlePointerEnter = (event: any) => {
    // Prevent event from bubbling and only trigger on the frontmost mesh
    event.stopPropagation();
    
    // Start move animation - move -2.0 on z-axis
    targetZPositionRef.current = -2.0;
    holdTimeRef.current = 0;
    isHoldingRef.current = false;
    isFlippingRef.current = false;
    
    // Don't reset rotation - let it accumulate from previous flips
  };

  

  // Continuous z-axis movement and y-axis rotation using useFrame
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    
    const isAtTarget = Math.abs(currentZPositionRef.current - (-2.0)) < 0.01;
    
    // If we've reached target position, start holding timer and flip animation
    if (isAtTarget && !isHoldingRef.current) {
      isHoldingRef.current = true;
      holdTimeRef.current = 0;
      isFlippingRef.current = true;
      targetYRotationRef.current += Math.PI; // Add 180 degrees to current rotation
    }
    
    // If holding, increment timer
    if (isHoldingRef.current) {
      holdTimeRef.current += delta;

      // After 0.5 seconds, move back but keep rotation
      if (holdTimeRef.current >= 0.5) {
        targetZPositionRef.current = 0;
        isHoldingRef.current = false;
        isFlippingRef.current = false;
        // Note: targetYRotationRef.current stays at Math.PI (180°)
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
    
    // Interpolate the current y rotation towards the target y rotation
    const rotationSpeed = 6; // Faster rotation for the flip effect
    const rotationLerpFactor = 1 - Math.exp(-rotationSpeed * delta);
    currentYRotationRef.current = MathUtils.lerp(
      currentYRotationRef.current,
      targetYRotationRef.current,
      rotationLerpFactor
    );
    
    // Apply precise rotation using quaternions
    const initialRotationQuaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(rotation[0], rotation[1], rotation[2])
    );
    
    // Create rotation quaternion for the Y-axis flip
    const yRotationQuaternion = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 1, 0),
      currentYRotationRef.current
    );
    
    // Combine rotations: apply Y rotation after initial rotation
    const finalQuaternion = new THREE.Quaternion()
      .multiplyQuaternions(initialRotationQuaternion, yRotationQuaternion);
    
    groupRef.current.quaternion.copy(finalQuaternion);
    
    // Apply transformations
    groupRef.current.position.z = position[2] + currentZPositionRef.current;
    
    // Snap to target if very close
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

// Preload the GLTF model
useGLTF.preload('/assets/models/hex_tile_4.glb');

export default HBlock;