import * as THREE from 'three';
import gsap from 'gsap';

export default class Visualizer {
    constructor(mesh, frequencyUniformName) {
        this.mesh = mesh;
        this.frequencyUniformName = frequencyUniformName;
        this.mesh.material.uniforms[this.frequencyUniformName] = { value: 0 };

        this.isReady = false;
        this.isPaused = true;

        this._initAudioHandler();
        this._initFileReader();
        this._initClockCursor();
    }

    _initAudioHandler() {
        this.listener = new THREE.AudioListener();
        this.mesh.add(this.listener);

        this.sound = new THREE.Audio(this.listener);
        this.loader = new THREE.AudioLoader();

        this.buffersSound = [];
        this.currentSound = 0;

        this.analyser = new THREE.AudioAnalyser(this.sound, 32);
    }

    _initFileReader() {
        this.reader = new FileReader();

        this.reader.addEventListener('load', (e) => {
            console.log(e);
            this.loader.load(this.reader.result, (buffer) => {
                this.buffersSound.push(buffer);
                this.currentSound++;

                this.setSound(this.buffersSound[this.currentSound - 1]);
                this.playSound();
            });
        });
    }

    _initClockCursor() {
        this.currentTime = 0;
    }

    setSound(buffer) {
        this.sound.setBuffer(buffer);
        this.sound.setLoop(true);
        this.sound.setVolume(0.5);

        this.isReady = true;
    }

    playSound() {
        if (this.sound.isPlaying) {
            return;
        }
        this.sound.play();
        this.isPaused = false;
    }

    pauseSound() {
        this.sound.pause();
        this.isPaused = true;
    }

    resetSound() {
        this.sound.stop();
        this.currentTime = 0;
        this.isPaused = true;
    }

    setVolume(volume) {
        this.sound.setVolume(volume);
    }

    changeSound(music) {
        this.resetSound();
        this.reader.readAsDataURL(music);
    }

    getFrequency() {
        return this.analyser.getAverageFrequency();
    }

    getTimeMusicPercentage() {
        return (this.currentTime * 100) / this.sound.buffer.duration;
    }

    update(deltaTime) {
        const frequency = Math.max(this.getFrequency() - 100, 0) / 50;
        const frequencyUniform = this.mesh.material.uniforms[this.frequencyUniformName];

        gsap.to(frequencyUniform, {
            duration: 1,
            ease: 'Slow.easeOut',
            value: frequency,
        });

        // handle time duration of music played
        if (!this.isPaused) {
            this.currentTime += deltaTime / 1000;
        }

        if (this.currentTime >= this.sound.buffer.duration) {
            this.sound.stop();
            this.currentTime = 0;
            this.isPaused = true;
        }
    }
}
