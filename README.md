# 3D Studio Labs

**Stage a Gaussian splat in the original Studio Labs frame.**

Open the viewer, orbit the capture, and switch how the title, date plate, and controls sit — without reloading the splat.

**Live:** [kbllr.github.io/3dmodel-splats-stager](https://kbllr.github.io/3dmodel-splats-stager/)

The hosted page stays on unbuilt source until GitHub Pages is set to **GitHub Actions** (see [Getting started](#getting-started)). After that switch, the link above is this app.

![Studio layout: date plate, display type, Tweakpane, and a rendered mesh](docs/screenshots/restored-studio.png)

## What you can do

- **Studio Labs design.** Roboto and Antonio, the November plate, the big display type, and Tweakpane. Studio is the default and uses that original frame.
- **Three layouts.** Studio, Editorial, and Catalog only move those same pieces. Changing layout does not reload the splat.
- **A camera you can actually use.** Drag to orbit, right-drag or two fingers to pan, wheel or pinch to zoom, with damping and distance limits. Reset view returns to the record's camera. Cinematic movement presets animate until you grab the view. Auto-rotate has a speed control.
- **Settings you can always hide.** A glass button stays on screen (blur, translucent fill, hairline, soft shadow; solid fill where `backdrop-filter` is missing). `H` or `.` does the same. The choice is stored in `localStorage` and works in every layout, including mobile.
- **Splash copy you can edit.** Title, subtitle, body text, and show/hide. Defaults come from the splat's JSON record. A shared link can override them with `?title=`, `?subtitle=`, `?text=` (or `?intro=`), and `?splash=0`.
- **One JSON file per splat.** Luma captures load through `LumaLabsLoader`. A mesh PLY loads through Three.js `PLYLoader`. `sample-mesh` is a tiny bundled triangle so the PLY path can be tried offline.
- **Grades, not a new look.** Clean, Soft, Cinematic, and Night set exposure, a fog preset, and a light vignette/grain overlay.

This app presents splats. It does not generate them.

## Getting started

Node.js 20.19+ or 22.12+ (the Pages workflow uses Node 24). npm 9+. This repo uses npm and `package-lock.json`.

```bash
git clone https://github.com/KBLLR/3dmodel-splats-stager.git
cd 3dmodel-splats-stager
npm ci
npm run dev
```

Vite prints a local URL, usually `http://localhost:5173/`.

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server. Base path is `/`. |
| `npm run build` | Production build into `dist/`, with base `/3dmodel-splats-stager/`. |
| `npm run preview` | Serves that build under `/3dmodel-splats-stager/`. |
| `npm run lint` | ESLint on `.js` files. |
| `npm run test` | Starts Vite. Open `/src/tests/` for the browser checks. |

### Deploy to GitHub Pages

Pushes to `main` run [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml): `npm ci`, `npm run build`, upload `dist/`.

In the GitHub repo, set **Settings → Pages → Build and deployment → Source** to **GitHub Actions**. The workflow does not change that setting. Leave it on "Deploy from a branch" and the site keeps serving raw source, so the splat and the built assets 404.

## Add a splat

Drop a JSON file in [`src/splats/records/`](src/splats/records/). [`src/splats/catalog.js`](src/splats/catalog.js) loads every `*.json` file.

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
| `title`, `subtitle`, `description` | Splash copy. `subtitle` is optional; otherwise the line is "with a human touch." |
| `captureDate`, `tags`, `location` | Extra metadata when Metadata is on and the field is listed in `visibleFields`. |
| `source.kind` | `luma` or `ply`. |
| `source.url` | Luma capture URL, an `http(s)` PLY URL, a site-root path, or `ply:<filename>` for a bundled reference. |
| `defaultCamera` | Key in `CAMERA_PRESETS`. Reset view returns here. |
| `defaultMovement` | `STATIC`, `HANDHELD`, `CRANE`, `DOLLY`, or `ORBIT`. |
| `defaultEffect` | `clean`, `soft`, `cinematic`, or `night`. |
| `visibleFields` | Ordered subset of `title`, `description`, `captureDate`, `tags`, `location`, `source`. |
| `demo` | When true, the viewer prefers this record on first load. |

Empty `captureDate` and `location` render as "Not recorded". Do not invent dates or coordinates. Do not commit secrets. The viewer does not read API tokens.

`?splat=`, `?camera=`, `?movement=`, `?effect=`, `?layout=`, and `?theme=light` also apply on load. `?layout=` and the Layout control only move the shell.

## Memory Blocks and the warehouse

The owner's Core-X house, **Memory Blocks**, is where these records are meant to live (`data/local-splats.json` and `data/scenes.json`). This app still reads the JSON files in the repo. It does not fetch Memory Blocks yet.

PLY files in `src/assets/ply` are local references. The canonical copies belong in the CoreX-Warehouse drive at `datasets/gaussian-splats/ply`. Point `source.url` at that object when the feed exists. Do not delete the local files as part of that switch.

## Make your own viewer

Keep this repository as the viewer. The reusable pieces are the JSON record, the catalog, and the settings object (`record`, then a saved edit, then the URL). Layouts are `data-layout` values on the original shell, not a second design system.

To start a new viewer: copy the repo, replace the files in `src/splats/records/`, and edit splash defaults in the record. On GitHub, **Settings → General → Template repository** lets other projects use **Use this template**. This repo does not flip that switch itself.

## Layouts

| Layout | What moves |
| --- | --- |
| Studio | Date plate top left, display type along the bottom, Tweakpane top right. |
| Editorial | Display type on the left, date plate underneath, camera buttons top left. |
| Catalog | A rail of plates lists every splat. The selected record keeps the bottom title. |

![Editorial layout](docs/screenshots/layout-editorial.png)

![Catalog layout](docs/screenshots/layout-catalog.png)

## Settings

The glass **Hide** / **Show** button sits at the bottom right. It stays up when the pane is closed. `aria-expanded` follows the pane. `H` and `.` toggle it unless focus is in a field. The last state is `localStorage` key `splats-stager.settings.v1`.

| Control | Where |
| --- | --- |
| Fog on/off, preset, description | Fog Controls (the original folder) |
| Movement preset, shake, stabilization | Camera Movement. Playback runs until a drag, pan, or zoom. |
| Camera preset, auto-rotate, speed, reset, stop | Camera |
| Splat, layout, effect, background | Stage |
| Show splash, title, subtitle, text, use record text | Splash |
| Metadata, light/dark theme, hide all UI | View |

Hide all UI clears the plates and the fps counter. The glass button stays so settings can come back. Editorial and Catalog also show **Reset view**, **Stop**, and **Auto-rotate** on the frame; they call the same camera rig as the pane.

![Settings open](docs/screenshots/settings-open.png)

![Settings hidden](docs/screenshots/settings-hidden.png)
