import * as THREE from 'three';

import Renderer from './Renderer';
import Camera from './Camera';
import Debug from './Utils/Debug';
import Resources from './Utils/Resources';
import Sizes from './Utils/Sizes';
import Time from './Utils/Time';
import World from './World/World';

import ControlPanel from './ControlPanel';

import sources from './sources';

let instance = null;

export default class App {
    constructor(canvas) {
        if (instance) {
            return instance;
        }
        instance = this;

        // Options
        this.canvas = canvas;

        // Setup
        this.debug = new Debug();
        this.sizes = new Sizes();
        this.time = new Time();
        this.scene = new THREE.Scene();
        this.resources = new Resources(sources);
        this.camera = new Camera();
        this.renderer = new Renderer();
        this.world = new World();

        this.controlPanel = new ControlPanel();

        this.sizes.on('resize', () => {
            this._resize();
        })

        this.time.on('tick', () => {
            this._update();
        })
    }

    _resize() {
        this.renderer.resize();
        this.camera.resize();
    }

    _update() {
        this.world.update(this.time.elapsed);
        this.controlPanel.updateCursor(this.time.delta);
        this.camera.update();
        this.renderer.update();
    }
}
