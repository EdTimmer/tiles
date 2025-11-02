import PipeTile from './PipeTile';
import Slot from './Slot';

interface Props {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}

const PipeAndSlot = ({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1 }: Props) => {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <Slot position={[0, 0.99, 0.2]} rotation={[0, 0, 0]} scale={1} />
      <PipeTile position={[0, 0, 0.3]} rotation={[0, 0, 0]} scale={1} />
    </group>
  );
};

export default PipeAndSlot;
