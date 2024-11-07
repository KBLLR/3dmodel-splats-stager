import { CinematicCamera } from '../components/cameras/CinematicCamera';
import { OrbitControls } from '../components/cameras/controls/OrbitControls';

export class CameraManager {
    constructor(renderer, container) {
        this.renderer = renderer;
        this.container = container;
        
        this.cameras = new Map();
        this.controls = new Map();
        this.activeCamera = null;
        this.activeControls = null;

        this.setupDefaultCameras();
    }

    setupDefaultCameras() {
        // Set up cinematic camera
        const cinematicCamera = new CinematicCamera({
            position: { x: 0, y: 2, z: 10 },
            target: { x: 0, y: 0, z: 0 },
            dof: {
                focus: 'center',
                aperture: 0.1,
                required: true
            }
        });

        this.addCamera('cinematic', cinematicCamera);
        
        // Set up controls
        if (this.renderer) {
            const controls = new OrbitControls(cinematicCamera, this.renderer.domElement);
            this.addControls('cinematic', controls);
        }
    }

    addCamera(name, camera) {
        this.cameras.set(name, camera);
        if (!this.activeCamera) {
            this.activeCamera = camera;
        }
    }

    addControls(name, controls) {
        this.controls.set(name, controls);
        if (!this.activeControls) {
            this.activeControls = controls;
        }
    }

    getCamera(name) {
        return this.cameras.get(name);
    }

    getControls(name) {
        return this.controls.get(name);
    }

    setActive(name) {
        const camera = this.cameras.get(name);
        const controls = this.controls.get(name);

        if (camera) {
            this.activeCamera = camera;
        }

        if (controls) {
            this.activeControls = controls;
        }
    }

    updateAspect(width, height) {
        this.cameras.forEach(camera => {
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        });
    }

    update() {
        if (this.activeControls && this.activeControls.update) {
            this.activeControls.update();
        }
    }
}
