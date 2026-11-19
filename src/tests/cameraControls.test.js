/**
 * Reset view and cinematic preset switching.
 */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { createCameraRig } from "../template/cameraRig.js";

const WIDE = { name: "Wide Shot", focalLength: 24, fstop: 5.6, focusDistance: 50 };
const CLOSE = { name: "Close Up", focalLength: 85, fstop: 1.4, focusDistance: 10 };
const STATIC = { name: "Static", movement: false, stabilization: true };
const ORBIT = { name: "Orbit", movement: true, path: "circular", speed: 0.8, radius: 6, height: 2 };

class CameraControlsTest {
  constructor() {
    this.testResults = document.getElementById("testResults");
    this.runTests();
  }

  logResult(message, passed) {
    if (!this.testResults) return;
    const div = document.createElement("div");
    div.textContent = `${passed ? "✅" : "❌"} ${message}`;
    div.style.color = passed ? "#4CAF50" : "#f44336";
    this.testResults.appendChild(div);
  }

  runTests() {
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    const canvas = document.querySelector("canvas") || document.createElement("canvas");
    const controls = new OrbitControls(camera, canvas);
    const rig = createCameraRig({
      camera,
      controls,
      domElement: canvas,
      matchMedia: { matches: false },
    });

    this.logResult("Drag orbits the camera", controls.mouseButtons.LEFT === THREE.MOUSE.ROTATE);
    this.logResult("Right-drag pans", controls.mouseButtons.RIGHT === THREE.MOUSE.PAN);
    this.logResult("Wheel zooms", controls.mouseButtons.MIDDLE === THREE.MOUSE.DOLLY && controls.enableZoom === true);
    this.logResult("One finger rotates", controls.touches.ONE === THREE.TOUCH.ROTATE);
    this.logResult("Two fingers pan and pinch-zoom", controls.touches.TWO === THREE.TOUCH.DOLLY_PAN);
    this.logResult("Orbit damping is on", controls.enableDamping === true);
    this.logResult("Distance is limited", controls.minDistance === 0.35 && controls.maxDistance === 80);

    rig.applyPreset("WIDE_SHOT", WIDE);
    rig.rememberHome("WIDE_SHOT", WIDE, STATIC);
    const home = camera.position.clone();
    const homeFov = camera.fov;

    rig.applyPreset("CLOSE_UP", CLOSE);
    this.logResult(
      "Switching camera preset moves the camera",
      camera.position.distanceTo(home) > 0.5,
    );
    this.logResult("Switching camera preset changes the lens", Math.abs(camera.fov - homeFov) > 0.5);

    camera.position.set(8, 4, 1);
    const reset = rig.resetView();
    this.logResult("Reset view reports success", reset === true);
    this.logResult(
      "Reset view returns to the record camera",
      camera.position.distanceTo(home) < 0.2,
    );
    this.logResult("Reset view restores the record lens", Math.abs(camera.fov - homeFov) < 0.2);
    this.logResult("Reset view stops cinematic playback", rig.isAnimating() === false);

    rig.applyPreset("WIDE_SHOT", WIDE);
    rig.applyMovement(ORBIT);
    this.logResult("A movement preset starts animating", rig.isAnimating() === true);
    rig.update(0);
    const atStart = camera.position.clone();
    rig.update(2.4);
    this.logResult("Cinematic playback moves the camera", camera.position.distanceTo(atStart) > 0.2);
    const heldAt = camera.position.clone();
    const stopped = rig.stopForUser();
    rig.update(9);
    this.logResult("User interaction stops the cinematic", stopped === true && rig.isAnimating() === false);
    this.logResult(
      "The camera holds after the cinematic stops",
      camera.position.distanceTo(heldAt) < 0.25,
    );

    rig.dispose();
    controls.dispose();
    this.logResult("Camera Tests Complete", true);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  new CameraControlsTest();
});
