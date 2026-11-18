/**
 * Routes a splat record to the loader for its source kind.
 * luma: Luma capture URL, or a path to Luma splat artifacts.
 * ply: fetchable mesh PLY URL, or a ply:<filename> reference registered in LOCAL_PLY.
 * The bundled example is a tiny triangle. Files in src/assets/ply are not registered.
 */

import { LumaLabsLoader } from "@loaders/LumaLabsLoader";
import { PlyMeshLoader } from "@loaders/PlyMeshLoader";

const LOCAL_PLY = {
  "triangle.ply": () => import("./fixtures/triangle.ply?url"),
};

const lumaLoader = new LumaLabsLoader();
const plyLoader = new PlyMeshLoader();

function withTimeout(promise, milliseconds, message) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), milliseconds);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}

async function resolvePlyUrl(sourceUrl) {
  if (/^https?:\/\//.test(sourceUrl) || sourceUrl.startsWith("/")) {
    return sourceUrl;
  }
  if (sourceUrl.startsWith("ply:")) {
    const fileName = sourceUrl.slice(4);
    const loadUrl = LOCAL_PLY[fileName];
    if (!loadUrl) {
      throw new Error(`No local PLY reference named ${fileName}`);
    }
    const module = await loadUrl();
    return module.default;
  }
  throw new Error("A PLY source must be an http(s) URL, a root path, or a ply: reference");
}

function releasePly(mesh) {
  mesh.geometry?.dispose();
  if (Array.isArray(mesh.material)) {
    mesh.material.forEach((material) => material.dispose());
  } else {
    mesh.material?.dispose();
  }
}

export async function loadSplatSource(record) {
  if (record.source.kind === "luma") {
    const object = await withTimeout(
      lumaLoader.load(record.source.url),
      25000,
      "The Luma capture timed out",
    );
    return {
      object,
      kind: "luma",
      release() {},
    };
  }

  if (record.source.kind === "ply") {
    const url = await resolvePlyUrl(record.source.url);
    const object = await withTimeout(plyLoader.load(url), 30000, "The PLY reference timed out");
    return {
      object,
      kind: "ply",
      release() {
        releasePly(object);
      },
    };
  }

  throw new Error(`Unsupported splat source kind: ${record.source?.kind}`);
}

export function disposeSplatLoaders() {
  lumaLoader.dispose();
  plyLoader.dispose();
}
