import { useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface Props {
  scale?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  onRowHover?: () => void;
}

const Slot = ({ scale = 4, position = [0, 0, 0], rotation = [0, 0, 0], onRowHover }: Props) => {
  const groupRef = useRef<THREE.Group>(null);
  const { nodes, materials } = useGLTF('/assets/models/slot-04.glb'); 
   
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

useGLTF.preload('/assets/models/slot-04.glb');

export default Slot;