import * as THREE from 'three';
import { Camera } from '../cameras/Camera.js';

export class DefaultScene extends THREE.Scene {
  constructor() {
    super();
    this.camera = new Camera();
    this.initialize();
  }

  initialize() {
    this.background = new THREE.Color('#000000');
  }
}
