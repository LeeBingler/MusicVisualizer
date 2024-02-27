import * as THREE from 'three';

import App from '../App';

import VertexShader from '../shaders/musicVisu/vertex.glsl';
import FragmentShader from '../shaders/musicVisu/fragment.glsl';

export default class SphereVisualizerMesh {
    constructor(size, widthSegment, heigthSegment) {
        this.app = new App();
        this.debug = this.app.debug;

        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Sphere');
        }

        this._initGeometry(size, widthSegment, heigthSegment);
        this._initMaterial();
        this._initSphere();
    }

    _initGeometry(size, widthSegment, heigthSegment) {
        this.geometry = new THREE.SphereGeometry(size, widthSegment, heigthSegment);
    }

    _initMaterial() {
        const uniforms = {
            uTime: { value: 0 },

            uFrequency: { value: 3 },
            uCellVariability: { value: 1 },
            uDirVariability: { value: 0 },
            uDisplacementForce: { value: 1 },
        };

        this.material = new THREE.ShaderMaterial({
            vertexShader: VertexShader,
            fragmentShader: FragmentShader,
            uniforms: uniforms,
        });

        if (this.debug.active) {
            this.debugFolder.add(uniforms.uFrequency, 'value').name('frequency').step(0.001).min(0).max(10);
            this.debugFolder.add(uniforms.uCellVariability, 'value').name('cellVariability').step(0.001).min(0).max(1.5);
            this.debugFolder.add(uniforms.uDirVariability, 'value').name('dirVariabilty').step(0.001).min(0).max(1.5);
            this.debugFolder.add(uniforms.uDisplacementForce, 'value').name('displacementForce').step(0.1).min(1).max(5);
        }
    }

    _initSphere() {
        this.instance = new THREE.Mesh(this.geometry, this.material);

        const wireframe = new THREE.LineSegments(this.geometry, this.material);
        wireframe.scale.setScalar(1 + 0.005);
        this.instance.add(wireframe);
    }

    update(elapsedTime) {
        this.material.uniforms.uTime.value = elapsedTime;
    }
}
