# 3D Model Splats Stager

A modern, high-performance 3D object stager specializing in Gaussian Splatting models, built with Three.js and Vite. This application enables advanced visualization of 3D models with sophisticated post-processing effects and real-time parameter adjustment.

## Key Features
- Advanced rendering pipeline using Three.js r157
- Gaussian Splatting support via Luma.ai integration
- Real-time parameter controls with Tweakpane 4.0.5
- High-quality post-processing effects
- Performance monitoring and optimization
- Modern ES modules architecture
- Progressive Web App (PWA) support
- Shader-based visual effects

## Technical Stack
- **Core Engine**: Three.js with ES modules
- **Build System**: Vite 5.4
- **UI Controls**: Tweakpane 4
- **Effects**: Post-processing 7.3.1
- **Performance**: Stats.js
- **Splatting**: Luma Web SDK

## Development Features
- Hot Module Replacement (HMR)
- GLSL shader support with minification
- SVG icon system
- Automatic compression for production builds
- Environment variable handling
- ESLint and Prettier configuration
- Type support for Three.js

## Asset Structure

HDR environment maps should be stored in `src/assets/environmentMaps/hdr/`.  
The example scene loads `placeholder.hdr` from this directory.  
Update `main.js` if you use a different file name.

## Troubleshooting

### Rollup native module error

If you see an error such as:

```bash
Cannot find module '@rollup/rollup-linux-x64-gnu'
