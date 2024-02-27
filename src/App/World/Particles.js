import * as THREE from 'three';
import gsap from 'gsap';

import VertexShaderNote from '../shaders/particlesMusicShape/vertex.glsl';
import FragmentShaderNote from '../shaders/particlesMusicShape/fragment.glsl';

import App from '../App';

export default class Particles {
    constructor(particlesCount) {
        this.app = new App();
        this.particlesCount = particlesCount;
        this.shapeTexture = [
            this.app.resources.items.TextureNote,
            this.app.resources.items.TextureStar,
        ];
        this.renderer = this.app.renderer.instance;
        this.debug = this.app.debug;

        if (this.debug.active) {
            this.debugFolder = this.debug.ui.addFolder('Particles');
        }

        this._setGeometry();
        this._setMaterial();
        this._setInstance();
    }

    _setGeometry() {
        const positionsParticle = new Float32Array(this.particlesCount * 3);
        const random = new Float32Array(this.particlesCount);

        for (let i = 0; i < this.particlesCount; i++) {
            const i3 = i * 3;

            positionsParticle[i3] = (Math.random() - 0.5) * 10 * 2;
            positionsParticle[i3 + 1] = (Math.random() - 0.5) * 15 * 2;
            positionsParticle[i3 + 2] = (Math.random() - 0.5) * 10 * 2;

            random[i] = Math.max(Math.random() + 0.2, 0.5);
        }

        this.geometry = new THREE.BufferGeometry();
        this.geometry.setAttribute('position', new THREE.BufferAttribute(positionsParticle, 3));
        this.geometry.setAttribute('aRandomness', new THREE.BufferAttribute(random, 1));
    }

    _setMaterial() {
        const debugObj = {
            texture: 0,
        };

        const uniforms = {
            uSize: { value: 40 * this.renderer.getPixelRatio() },
            uTime: { value: 0 },
            uSpeedAnimation: { value: 0.1 },

            uTexture: { value: this.shapeTexture[0] },
            uAudioFrequency: { value: 0 },
        };

        this.material = new THREE.ShaderMaterial({
            blending: THREE.AdditiveBlending,
            vertexShader: VertexShaderNote,
            fragmentShader: FragmentShaderNote,
            depthWrite: false,
            uniforms: uniforms,
        });

        if (this.debug.active) {
            this.debugFolder
                .add(uniforms.uSize, 'value')
                .name('sizeParticles')
                .min(1)
                .max(200)
                .step(1);

            this.debugFolder
                .add(uniforms.uSpeedAnimation, 'value')
                .name('speedUpParticles')
                .min(0.001)
                .max(1)
                .step(0.001);

            this.debugFolder
                .add(debugObj, 'texture')
                .step(1)
                .min(0)
                .max(1)
                .onChange((value) => {
                    this.material.uniforms.uTexture.value = this.shapeTexture[value];
                });
        }
    }

    _setInstance() {
        this.instance = new THREE.Points(this.geometry, this.material);
    }

    update(elapsedTime, actualFrequency) {
        this.material.uniforms.uTime.value = elapsedTime;

        const frequency = Math.max(actualFrequency - 100, 0) / 50;
        const frequencyUniform = this.instance.material.uniforms.uAudioFrequency;

        gsap.to(frequencyUniform, {
            duration: 1.5,
            ease: 'Slow.easeOut',
            value: frequency,
        });
    }
}
