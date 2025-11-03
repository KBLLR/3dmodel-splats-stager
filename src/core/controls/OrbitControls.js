import * as THREE from "three";

export class OrbitControls {
  constructor(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;

    // Control states
    this.isMouseDown = false;
    this.mousePosition = { x: 0, y: 0 };
    this.target = new THREE.Vector3(0, 0, 0);

    // Control settings
    this.rotationSpeed = 0.005;
    this.zoomSpeed = 0.1;
    this.minDistance = 1;
    this.maxDistance = 100;

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.domElement.addEventListener("mousedown", this.onMouseDown.bind(this));
    this.domElement.addEventListener("mousemove", this.onMouseMove.bind(this));
    this.domElement.addEventListener("mouseup", this.onMouseUp.bind(this));
    this.domElement.addEventListener("wheel", this.onMouseWheel.bind(this));
  }

  onMouseDown(event) {
    this.isMouseDown = true;
    this.mousePosition.x = event.clientX;
    this.mousePosition.y = event.clientY;
  }

  onMouseMove(event) {
    if (!this.isMouseDown) return;

    const deltaX = event.clientX - this.mousePosition.x;
    const deltaY = event.clientY - this.mousePosition.y;

    // Convert to spherical coordinates for rotation
    const spherical = new THREE.Spherical().setFromVector3(
      this.camera.position.clone().sub(this.target),
    );

    // Update angles
    spherical.phi = Math.max(
      0.1,
      Math.min(Math.PI - 0.1, spherical.phi + deltaY * this.rotationSpeed),
    );
    spherical.theta += deltaX * this.rotationSpeed;

    // Convert back to Cartesian coordinates
    this.camera.position.setFromSpherical(spherical).add(this.target);
    this.camera.lookAt(this.target);

    this.mousePosition.x = event.clientX;
    this.mousePosition.y = event.clientY;
  }

  onMouseUp() {
    this.isMouseDown = false;
  }

  onMouseWheel(event) {
    const zoomDelta = Math.sign(event.deltaY) * this.zoomSpeed;
    const distance = this.camera.position.distanceTo(this.target);

    // Calculate new distance with constraints
    const newDistance = Math.max(
      this.minDistance,
      Math.min(this.maxDistance, distance * (1 + zoomDelta)),
    );

    const direction = this.camera.position
      .clone()
      .sub(this.target)
      .normalize()
      .multiplyScalar(newDistance);

    this.camera.position.copy(this.target).add(direction);
  }

  update() {
    // Add any per-frame updates if needed
  }

  dispose() {
    this.domElement.removeEventListener("mousedown", this.onMouseDown);
    this.domElement.removeEventListener("mousemove", this.onMouseMove);
    this.domElement.removeEventListener("mouseup", this.onMouseUp);
    this.domElement.removeEventListener("wheel", this.onMouseWheel);
  }
}
