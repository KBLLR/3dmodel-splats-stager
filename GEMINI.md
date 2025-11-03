# Project Overview

This is a 3D model stager for Gaussian Splatting models, built with Three.js and Vite. This application enables advanced visualization of 3D models with sophisticated post-processing effects and real-time parameter adjustment.

The project is structured with a clear separation of concerns, using a manager-based architecture to handle different aspects of the 3D scene, such as cameras, environments, and components. It uses Tweakpane for UI controls and has a clear entry point in `main.js`.

## Key Technologies

- **Core Engine**: Three.js with ES modules
- **Build System**: Vite 5.4
- **UI Controls**: Tweakpane 4
- **Effects**: Post-processing 7.3.1
- **Performance**: Stats.js
- **Splatting**: Luma Web SDK

## Building and Running

### Development

To run the project in development mode with hot module replacement, use:

```bash
npm run dev
```

### Production Build

To build the project for production, use:

```bash
npm run build
```

This will create a `dist` directory with the optimized and minified assets.

### Preview

To preview the production build locally, use:

```bash
npm run preview
```

## Testing

The project includes a scene test that can be run with:

```bash
npm run test
```

## Development Conventions

### Linting and Formatting

The project uses ESLint for linting and Prettier for code formatting. To automatically fix linting issues and format the code, run:

```bash
npm run lint
npm run format
```

### Code Structure

The project follows a modular structure with a clear separation of concerns. The `src` directory contains the core logic, components, managers, and assets.

- `src/core`: Contains the core components of the application, such as managers, generators, scenes, and renderers.
- `src/gui`: Contains the Tweakpane UI manager.
- `src/presets`: Contains presets for cameras, environments, and other components.
- `src/assets`: Contains all the static assets, such as models, textures, and environment maps.
