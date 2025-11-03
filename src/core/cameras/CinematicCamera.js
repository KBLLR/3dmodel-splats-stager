import { CinematicCamera as ThreeCinematicCamera } from "three/examples/jsm/cameras/CinematicCamera";

export class CinematicCamera extends ThreeCinematicCamera {
  constructor(params = {}) {
    const {
      fov = 75,
      aspect = window.innerWidth / window.innerHeight,
      near = 0.1,
      far = 1000,
      position = { x: 0, y: 2, z: 5 },
      dof = {
        focus: 10,
        aperture: 0.1,
      },
    } = params;

    super(fov, aspect, near, far);

    this.type = "cinematic";
    this.isCustomCamera = true;

    // Set position
    this.position.set(position.x, position.y, position.z);

    // Initialize postprocessing if not exists
    if (!this.postprocessing) {
      this.postprocessing = {
        bokeh: {
          focus: dof.focus,
          aperture: dof.aperture,
        },
      };
    }

    // Set DOF parameters
    this.setLens();
    if (this.postprocessing.bokeh) {
      this.postprocessing.bokeh.focus = dof.focus;
      this.postprocessing.bokeh.aperture = dof.aperture;
    }

    this.debugObject = {
      position,
      dof,
      fov,
      near,
      far,
    };
  }

  updateFromDebug() {
    // Update position
    this.position.set(
      this.debugObject.position.x,
      this.debugObject.position.y,
      this.debugObject.position.z,
    );

    // Update DOF
    if (this.postprocessing.bokeh) {
      this.postprocessing.bokeh.focus = this.debugObject.dof.focus;
      this.postprocessing.bokeh.aperture = this.debugObject.dof.aperture;
    }

    this.fov = this.debugObject.fov;
    this.near = this.debugObject.near;
    this.far = this.debugObject.far;

    this.updateProjectionMatrix();
  }
}
