# 3D Model Splats Stager

A modern, high-performance 3D object stager specializing in Gaussian Splatting models, built with Three.js and Vite. This application enables advanced visualization of 3D models with sophisticated post-processing effects and real-time parameter adjustment, serving as a powerful tool for artists, designers, and developers to test and showcase their 3D assets in a feature-rich environment.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have Node.js and npm installed on your system. You can download them from [nodejs.org](https://nodejs.org/).

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/3d-model-splats-stager.git
    cd 3d-model-splats-stager
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

## Usage

### Running the Development Server

To start the development server with hot module replacement, run the following command:

```bash
npm run dev
```

This will open the application in your default browser, typically at `http://localhost:5173`.

### Running Tests

The project includes a suite of browser-based tests. To run them, use the following command:

```bash
npm run test
```

This will start a Vite server to serve the tests from the `src/tests` directory. Open the provided URL in your browser to see the test results.

### Building for Production

To build the application for production, run:

```bash
npm run build
```

This command will create a `dist` directory with the optimized and minified assets, ready for deployment.

## Project Structure

The project's source code is located in the `src` directory and is organized as follows:

-   **`src/assets`**: Contains static assets like environment maps and icons.
-   **`src/core`**: The core application logic, divided into subdirectories:
    -   **`components`**: Reusable Three.js components (cameras, lights, materials, etc.).
    -   **`generators`**: Classes that generate complex objects like scenes and stages.
    -   **`managers`**: Classes that manage different aspects of the application (scenes, cameras, loaders, etc.).
    -   **`renderers`**: Custom Three.js renderer classes with specific configurations.
    -   **`scenes`**: Definitions for different scenes within the application.
    -   **`utils`**: Core utility functions.
-   **`src/presets`**: Contains preset configurations for cameras, fog, scenes, and models.
-   **`src/tests`**: Contains the browser-based test suite.
-   **`src/utils`**: General utility functions for the application.

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