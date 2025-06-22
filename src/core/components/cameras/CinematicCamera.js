import { CinematicCamera as ThreeCinematicCamera } from 'three/examples/jsm/cameras/CinematicCamera';

export class CinematicCamera extends ThreeCinematicCamera {
    constructor(params = {}) {
        const {
            fov = 75,
            aspect = window.innerWidth / window.innerHeight,
            near = 0.1,
            far = 1000,
            position = { x: 0, y: 2, z: 10 },
            target = { x: 0, y: 0, z: 0 },
            dof = {
                focus: 'center',
                aperture: 0.1,
                required: true
            }
        } = params;

        super(fov, aspect, near, far);

        this.type = 'cinematic';
        this.isCustomCamera = true;

        // Set position
        this.position.set(position.x, position.y, position.z);
        
        // Set target
        this.lookAt(target.x, target.y, target.z);

        // Set DOF parameters
        this.setLens(35, 1.6);
        this.postprocessing.bokeh.focus = 
            dof.focus === 'center' ? 
            this.position.length() : 
            dof.focus;
        this.postprocessing.bokeh.aperture = dof.aperture;

        this.debugObject = {
            position,
            target,
            dof,
            fov,
            near,
            far
        };
    }

    updateFromDebug() {
        // Update position
        this.position.set(
            this.debugObject.position.x,
            this.debugObject.position.y,
            this.debugObject.position.z
        );

        // Update target
        this.lookAt(
            this.debugObject.target.x,
            this.debugObject.target.y,
            this.debugObject.target.z
        );

        // Update DOF
        if (this.debugObject.dof) {
            this.postprocessing.bokeh.focus = 
                this.debugObject.dof.focus === 'center' ? 
                this.position.length() : 
                this.debugObject.dof.focus;
            this.postprocessing.bokeh.aperture = this.debugObject.dof.aperture;
        }

        this.updateProjectionMatrix();
    }
}
