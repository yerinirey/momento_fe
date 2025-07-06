import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber/native";
import { Suspense, useState } from "react";
import Model from "../3dModel/Model";
import Trigger from "../3dModel/Trigger";
type ModelProps = {
  modelUrl: string;
};

export default function ModelView({ modelUrl }: ModelProps) {
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <Canvas style={{ flex: 1, backgroundColor: "black" }}>
      <OrbitControls enablePan={false} enableZoom={false} />
      <directionalLight position={[1, 0, 0]} args={["white", 2]} />
      <directionalLight position={[-1, 0, 0]} args={["white", 2]} />
      <directionalLight position={[0, 0, 1]} args={["white", 2]} />
      <directionalLight position={[0, 0, -1]} args={["white", 2]} />
      <directionalLight position={[0, 1, 0]} args={["white", 15]} />
      <directionalLight position={[0, -1, 0]} args={["white", 2]} />
      <Suspense fallback={<Trigger setLoading={setLoading} />}>
        <Model modelUrl={modelUrl} />
      </Suspense>
    </Canvas>
  );
}
