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

        this.reader.addEventListener('load', () => {
            this.loader.load(this.reader.result, (buffer) => {
                this.addSound(buffer, this.nameMusic);
                this.currentSound = this.buffersSound.length - 1;
                this.setSound(this.currentSound);
                this.playSound();
            });
        });
    }

    _initClockCursor() {
        this.currentTime = 0;
    }

    addSound(buffer, name) {
        this.buffersSound.push({ buffer, name });
    }

    setSound(index) {
        this.sound.setBuffer(this.buffersSound[index].buffer);
        this.sound.setLoop(true);
        this.sound.setVolume(0.5);

        this.isReady = true;
    }

    uploadSound(music) {
        this.resetSound();
        this.nameMusic = music.name;
        this.reader.readAsDataURL(music);
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

    nextSound() {
        const next = this.currentSound + 1 >= this.buffersSound.length ? 0 : this.currentSound + 1;
        this.currentSound = next;

        this.resetSound();
        this.setSound(this.currentSound);
        this.playSound();
    }

    prevSound() {
        const prev = this.currentSound - 1 < 0 ? this.buffersSound.length - 1 : this.currentSound - 1;
        this.currentSound = prev;

        this.resetSound();
        this.setSound(this.currentSound);
        this.playSound();
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
