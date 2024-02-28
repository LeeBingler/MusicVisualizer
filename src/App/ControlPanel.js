import App from './App';

export default class ControlPanel {
    constructor() {
        this.app = new App();
        this.visualizer = this.app.world.visualizer;

        this._initControlPanel();
        this._addToDom();
    }

    _initControlPanel() {
        this.instance = document.createElement('footer');
        this.instance.id = 'control';

        this._createCursor();
        this._createFilePanel();
        this._createButtonPanel();
        this._createVolumePanel();
    }

    _createCursor() {
        this.cursorPanel = document.createElement('div');
        this.cursorPanel.classList.add('cursor-time-container');

        this.nameSong = document.createElement('h1');
        this.nameSong.classList.add('name-song');
        this.nameSong.textContent = 'BLACKPINK-ShutDown.mp3';

        this.cursor = document.createElement('div');
        this.cursor.classList.add('cursor-time');

        this.cursorPanel.appendChild(this.cursor);
        this.cursorPanel.appendChild(this.nameSong);

        this.instance.appendChild(this.cursorPanel);
    }

    _changeNameSong(name) {
        this.nameSong.textContent = name;
    }

    _createFilePanel() {
        this.filePanel = document.createElement('div');
        this.filePanel.classList.add('file_upload-container');

        this.fileLabel = document.createElement('label');
        this.fileLabel.textContent = 'Upload Your Music';

        this.fileInput = document.createElement('input');
        this.fileInput.type = 'file';
        this.fileInput.id = 'file_upload';
        this.fileInput.accept = 'audio/*';

        this.filePanel.appendChild(this.fileInput);
        this.filePanel.appendChild(this.fileLabel);

        this.instance.append(this.filePanel);

        this._initEventListenerFileUpload();
    }

    _initEventListenerFileUpload() {
        this.fileInput.addEventListener('change', (e) => {
            const music = this.fileInput.files[0];

            this.visualizer.uploadSound(music);
            this._changeNameSong(music.name);
        });
    }

    _createButtonPanel() {
        this.buttonPanel = document.createElement('div');
        this.buttonPanel.classList.add('button-container');

        this.playButton = document.createElement('button');
        this.pauseButton = document.createElement('button');
        this.resetButton = document.createElement('button');

        this.nextButton = document.createElement('button');
        this.prevButton = document.createElement('button');

        this.playButton.textContent = 'Play';
        this.pauseButton.textContent = 'Pause';
        this.resetButton.textContent = 'Reset';

        this.nextButton.textContent = '>';
        this.prevButton.textContent = '<';

        this.buttonPanel.appendChild(this.prevButton);
        this.buttonPanel.appendChild(this.playButton);
        this.buttonPanel.appendChild(this.nextButton);
        this.buttonPanel.appendChild(this.pauseButton);
        this.buttonPanel.appendChild(this.resetButton);

        this.instance.appendChild(this.buttonPanel);

        this._initEventListenerButton();
    }

    _initEventListenerButton() {
        this.playButton.addEventListener('click', () => {
            this.visualizer.playSound();
        });

        this.pauseButton.addEventListener('click', () => {
            this.visualizer.pauseSound();
        });

        this.resetButton.addEventListener('click', () => {
            this.visualizer.resetSound();
        });

        this.nextButton.addEventListener('click', () => {
            this.visualizer.nextSound();
            this._changeNameSong(this.visualizer.buffersSound[this.visualizer.currentSound].name);
        });

        this.prevButton.addEventListener('click', () => {
            this.visualizer.prevSound();
            this._changeNameSong(this.visualizer.buffersSound[this.visualizer.currentSound].name);
        });
    }

    _createVolumePanel() {
        this.volumePanel = document.createElement('div');
        this.volumePanel.classList.add('volume-container');

        this.volumeInput = document.createElement('input');
        this.volumeInput.type = 'range';
        this.volumeInput.id = 'volume';
        this.volumeInput.min = 0;
        this.volumeInput.max = 1;
        this.volumeInput.step = 0.1;
        this.volumeInput.value = 0.5;

        this.volumeLabel = document.createElement('label');
        this.volumeLabel.htmlFor = 'volume';
        this.volumeLabel.textContent = 'Volume';

        this.volumePanel.appendChild(this.volumeInput);
        this.volumePanel.appendChild(this.volumeLabel);

        this.instance.appendChild(this.volumePanel);

        this._initEventListenerVolume();
    }

    _initEventListenerVolume() {
        this.volumeInput.addEventListener('change', (e) => {
            const volume = e.originalTarget.value;

            this.visualizer.setVolume(volume);
        });
    }

    _addToDom() {
        document.body.appendChild(this.instance);
    }

    updateCursor() {
        let percentage = 0;

        if (this.visualizer.isReady) {
            percentage = this.visualizer.getTimeMusicPercentage();
        }

        document.documentElement.style.setProperty('--percentage', `${(100 - percentage) * -1}%`);
    }
}
