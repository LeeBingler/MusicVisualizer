import SphereVisualizerMesh from './SphereVisualizerMesh';
import Visualizer from './Visualizer';
import Particles from './Particles';
import App from '../App';

export default class World {
    constructor() {
        this.app = new App();
        this.scene = this.app.scene;
        this.resources = this.app.resources;

        this.sphere = new SphereVisualizerMesh(1, 100, 100);
        this.visualizer = new Visualizer(this.sphere.instance, 'uAudioFrequency');

        this.resources.on('ready', () => {
            this.particles = new Particles(800);
            this.visualizer.addSound(this.resources.items.defaultMusic, 'BLACKPINK-ShutDown.mp3');
            this.visualizer.addSound(this.resources.items.merryGoesRoundMusic, 'Merry Go Round of Life.mp3');
            this.visualizer.setSound(0);
            this._addWorld();
        });
    }

    _addWorld() {
        this.scene.add(this.sphere.instance, this.particles.instance);
    }

    update(elapsedTime, deltaTime) {
        if (this.particles) {
            this.sphere.update(elapsedTime);
            this.visualizer.update(deltaTime);
            this.particles.update(elapsedTime, this.visualizer.getFrequency());
        }
    }
}
