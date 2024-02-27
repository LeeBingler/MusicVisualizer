import * as THREE from 'three';
import EventEmitter from './EventEmitter';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default class Resources extends EventEmitter {
    constructor(sources) {
        super();

        // Options
        this.sources = sources;

        // Setup
        this.items = {};
        this.toLoad = this.sources.length;
        this.loaded = 0;

        this._setLoaders();
        this.startLoading();
    }

    _setLoaders() {
        this.loaders = {};
        this.loaders.textureLoader = new THREE.TextureLoader();
        this.loaders.audioLoader = new THREE.AudioLoader();
    }


    _sourceLoaded(source, file) {
        this.items[source.name] = file;

        this.loaded++;
        this.trigger('load');

        if (this.loaded === this.toLoad) {
            this.trigger('ready');
        }
    }

    startLoading() {
        // load each source
        for (const source of this.sources) {
            if (source.type === 'texture') {
                this.loaders.textureLoader.load(source.path, (file) => {
                    this._sourceLoaded(source, file);
                });
            } else if (source.type === 'audio') {
                this.loaders.audioLoader.load(source.path, (file) => {
                    this._sourceLoaded(source, file);
                });
            }
        }
    }
}
