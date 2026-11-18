# Splat Template

A reusable viewer for **presenting** Gaussian splats. Load a splat, choose which metadata fields fill the interface, and swap the layout, cinematic camera, and effect. This project does not generate splats.

The page is a dark stage with three layouts (Studio, Editorial, Catalog), a splat library, camera and movement controls, and a small set of presentation grades. The default records are Luma captures. One extra record loads a tiny triangle mesh so the PLY path can be tried without a download.

## What the viewer does

- Loads a **Luma capture** through `LumaLabsLoader` (`@lumaai/luma-web`), or a **mesh PLY** through Three.js `PLYLoader`.
- Fills the open layout from the splat record. The record's `visibleFields` list is the only metadata drawn in that block. The library and the Editorial splat menu still show titles so you can change the selection.
- Swaps UI compositions without reloading the source: Studio (side panel), Editorial (large type), Catalog (card rail).
- Applies a cinematic camera preset (focal length becomes field of view, plus focus and aperture) and a movement preset (static, handheld, crane, dolly, orbit).
- Applies an effect: renderer exposure, a fog preset color at a light density, and a vignette/grain overlay. Switching an effect replaces the stage color.

Orbit the stage when movement is Static. The other movements take the camera until you return to Static. If the operating system asks for reduced motion, movement presets hold a still frame.

## JSON per splat

Each splat is one file in [`src/splats/records/`](src/splats/records/). [`src/splats/catalog.js`](src/splats/catalog.js) loads every `*.json` file and publishes them as `MODEL_PRESETS`.

```json
{
  "id": "autovan",
  "title": "Autovan",
  "description": "Demo Gaussian splat loaded from a Luma capture URL.",
  "captureDate": null,
  "tags": ["demo", "luma", "vehicle"],
  "location": null,
  "defaultCamera": "WIDE_SHOT",
  "defaultMovement": "STATIC",
  "defaultEffect": "cinematic",
  "visibleFields": ["title", "description", "tags"],
  "demo": true,
  "source": {
    "kind": "luma",
    "url": "https://lumalabs.ai/capture/5be32ec6-b11f-44eb-bbb7-57c5beee0d75"
  }
}
```

| Field | Role |
| --- | --- |
| `id` | Preset name. `PresetManager.loadPreset("models", id)` returns the record. |
| `title`, `description`, `captureDate`, `tags`, `location` | Metadata the layout may show. |
| `source.kind` | `luma` or `ply`. |
| `source.url` | Luma capture URL, an `http(s)` PLY URL, a site-root path, or `ply:<filename>` for a file already in `src/assets/ply`. |
| `defaultCamera` | Key in `CAMERA_PRESETS`. |
| `defaultMovement` | Key in `CAMERA_MOVEMENT_PRESETS`. |
| `defaultEffect` | `clean`, `soft`, `cinematic`, or `night`. |
| `visibleFields` | Ordered subset of `title`, `description`, `captureDate`, `tags`, `location`, `source`. |
| `demo` | When true, the viewer prefers this record on first load. |

Empty `captureDate` and `location` render as "Not recorded". The files do not invent dates or coordinates.

`src/presets/index.js` already had an empty `PRESET_REGISTRY.MODELS` slot (`"models"`). `PresetManager` now loads that slot from the catalog. Camera, camera-movement, and fog presets are unchanged and still load the same way.

### One list instead of two

`src/config/lumaSplats.js` (`LUMA_SPLATS`) and `src/presets/lumaLabsModels.js` (`LUMA_MODELS`) used to repeat capture URLs. Both files now re-export maps built from the JSON records.

- `LUMA_SPLATS` is every Luma record that belonged to the old splat list.
- `LUMA_MODELS` is the smaller set that belonged to the old model list.
- **TREE is not a record.** In `LUMA_SPLATS` it used Autovan's URL. In `LUMA_MODELS` the same id was Autovan's URL with a trailing `l` (`…0d75l`). Autovan keeps the shared capture URL.

Two records are marked `demo: true` and use those existing Luma URLs: Autovan and Centro Cultural.

## Where the records live

The viewer's current source is the JSON files in this repository.

The owner's Core-X house, **Memory Blocks**, is the place those records are meant to live. In that house the splat records are `data/local-splats.json` and `data/scenes.json`. This app does not fetch Memory Blocks yet. See Next steps.

## Template map

| Concern | Where it lives |
| --- | --- |
| Splat source / loading | [`src/splats/SplatSource.js`](src/splats/SplatSource.js), [`LumaLabsLoader`](src/core/components/loaders/LumaLabsLoader.js), [`PlyMeshLoader`](src/core/components/loaders/PlyMeshLoader.js). `LoaderManager` registers both loaders (`splat` and `ply`). |
| Per-splat metadata | [`src/splats/records/*.json`](src/splats/records/) and [`src/splats/catalog.js`](src/splats/catalog.js). [`src/splats/fields.js`](src/splats/fields.js) formats `visibleFields`. |
| UI compositions | [`src/template/compositions/`](src/template/compositions/) (`studio`, `editorial`, `catalog`). [`ViewerApp`](src/template/ViewerApp.js) owns the stage. |
| Cinematic cameras | [`src/presets/cameraPresets.js`](src/presets/cameraPresets.js) and [`src/template/cameraRig.js`](src/template/cameraRig.js). The rig frames each preset; lens numbers come from the preset. |
| Effects | [`src/effects/effectPresets.js`](src/effects/effectPresets.js) and [`src/effects/applyEffect.js`](src/effects/applyEffect.js). Fog colors come from [`src/presets/fogPresets.js`](src/presets/fogPresets.js). |

Entry: [`index.html`](index.html) loads [`src/main.js`](src/main.js), which starts `ViewerApp`. The renderer is `LumaRenderer` (ACES filmic, sRGB). The camera is `CinematicCamera`.

A Luma load that fails or times out leaves the metadata on screen and a short status line. `sample-mesh` is not a Gaussian splat. It loads [`src/splats/fixtures/triangle.ply`](src/splats/fixtures/triangle.ply), a small ASCII triangle, through `ply:<filename>`. Any other mesh PLY can use an `http(s)` URL or a site-root path on `source.url`. The binary meshes already in `src/assets/ply` stay where they are. They are trimesh exports, they are not referenced by the catalog, and they are not the warehouse copies.

Vignette and grain are CSS overlays. Fog and exposure hit the Three.js scene and renderer. `CinematicRenderer` still stores vignette and grain flags on `debugObject`; there is no bloom or film pass in this template.

## Getting started

Node.js 18+ and npm 9+. This repo uses npm and `package-lock.json`.

```bash
git clone https://github.com/KBLLR/3dmodel-splats-stager.git
cd 3dmodel-splats-stager
npm ci
npm run dev
```

Vite prints the local URL (port 5173 unless that port is taken).

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload. |
| `npm run build` | Production build into `dist/`. |
| `npm run preview` | Serve the production build. |
| `npm run lint` | ESLint on `.js` files. |
| `npm run format` | Prettier write. |
| `npm run test` | Starts Vite. Open `/src/tests/` for the browser checks (scene config, presets, and the splat catalog). |

To add a splat, drop a JSON file in `src/splats/records/` using the fields above. Use a Luma capture URL you are allowed to present, or a PLY URL. Do not commit secrets. The viewer does not read API tokens.

## Next steps

1. **Wire Memory Blocks as the metadata source.** Read the Core-X Memory Blocks house (`data/local-splats.json` and `data/scenes.json`) instead of only the JSON files under `src/splats/records/`. Keep the same record shape so compositions, cameras, and effects stay swappable.
2. **Treat the CoreX-Warehouse drive as the only source of truth for `.ply` files.** The canonical path is `datasets/gaussian-splats/ply`. Files in `src/assets/ply`, and any cloud copy, are references. Point `source.url` at the warehouse object. Do not move or delete the local PLY files as part of that switch.
3. **Curate the demo set.** Autovan and Centro Cultural are marked `demo` so the template has two working Luma entries. Replace or trim them once Memory Blocks and the warehouse feed are connected.
4. **Deploy to GitHub Pages.** [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) already runs `npm ci`, `npm run build`, and uploads `dist/` on pushes to `main`. Publish from that workflow after the metadata source and warehouse URLs are in place, so the hosted viewer is not left pointing at local references.
