import { useEffect } from "react";
import { useGLTF } from "@react-three/drei/native";
import * as FileSystem from "expo-file-system";

export function useDumpGLTF(uri: string, name?: string) {
  const gltf = useGLTF(uri, true);

  useEffect(() => {
    const pure = gltf?.parser?.json;
    if (!pure) return;

    if (__DEV__) {
      console.log("Asset Info:", pure.asset);
      console.log(
        "Meshes:",
        pure.meshes?.length,
        "Materials:",
        pure.materials?.length
      );
    }

    if (name) {
      const path = FileSystem.cacheDirectory + `${name}.json`;
      FileSystem.writeAsStringAsync(path, JSON.stringify(pure, null, 2)).then(
        () => {
          if (__DEV__) console.log("GLTF JSON saved to", path);
        }
      );
    }
  }, [gltf]);

  return gltf;
}

export function summarizeGLTF(pure: any) {
  const meshes = pure.meshes ?? [];
  const materials = pure.materials ?? [];
  return meshes.flatMap((m: any, mi: number) =>
    (m.primitives ?? []).map((p: any, pi: number) => {
      const attrs = Object.keys(p.attributes ?? {});
      return {
        mesh: mi,
        prim: pi,
        attributes: attrs,
        hasUV: attrs.includes("TEXCOORD_0"),
        hasColor: attrs.includes("COLOR_0"),
        materialIndex: p.material ?? "(none)",
        materialValid:
          p.material === undefined ||
          (p.material >= 0 && p.material < materials.length),
      };
    })
  );
}
