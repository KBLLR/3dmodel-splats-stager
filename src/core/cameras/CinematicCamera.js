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

    // Set DOF parameters
    // The ThreeCinematicCamera's setLens method and properties handle the bokeh effect.
    // Call setLens with initial DOF parameters to ensure 'focus' and 'aperture' properties are initialized.
    // We pass undefined for focalLength, filmGauge, and maxblur to use their defaults.
    this.setLens(undefined, undefined, fov, aspect, near, far, dof.focus, dof.aperture, undefined);

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
    this.focus = this.debugObject.dof.focus;
    this.aperture = this.debugObject.dof.aperture;
    this.setLens(); // Call setLens to update the internal postprocessing.bokeh

    this.fov = this.debugObject.fov;
    this.near = this.debugObject.near;
    this.far = this.debugObject.far;

    this.updateProjectionMatrix();
  }
}
