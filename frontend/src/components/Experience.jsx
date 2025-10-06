import { Environment, OrbitControls, useTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Avatar } from "./Avatar";

export const Experience = () => {
  const texture = useTexture("textures/image.png");
  const viewport = useThree((state) => state.viewport);

  return (
    <>
      <OrbitControls enabled={false} />
      <Avatar position={[0, -3, 5]} scale={2} />
      <Environment preset="sunset" />
      <mesh>
        <planeGeometry args={[viewport.width, viewport.height]} />
        <meshBasicMaterial map={texture} />
      </mesh>
    </>
  );
};
