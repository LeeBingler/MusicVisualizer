import * as THREE from 'three';
import App from './App';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class Camera {
    constructor() {
        this.app = new App();
        this.time = this.app.time;
        this.sizes = this.app.sizes;
        this.canvas = this.app.canvas;
        this.scene = this.app.scene;

        this.numberOfScene = 3;

        this._setInstance();
        this._setControler();
    }

    _setInstance() {
        this.instance = new THREE.PerspectiveCamera(
            75,
            this.sizes.width / this.sizes.height,
            0.1,
            100
        );
        this.instance.position.z = 3;

        this.scene.add(this.instance);
    }

    _setControler() {
        this.controler = new OrbitControls(this.instance, this.canvas);

        this.controler.enableDamping = true;
        this.controler.enableZoom = false;
    }

    resize() {
        this.instance.aspect = this.sizes.width / this.sizes.height;
        this.instance.updateProjectionMatrix();
    }

    update() {
        this.controler.update();
    }
}
