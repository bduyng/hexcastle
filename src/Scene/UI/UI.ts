import * as PIXI from 'pixi.js';
import MuteButton from './UIObjects/MuteButton';
import Button from './UIObjects/Button';
import { GlobalEventBus } from '../../Core/GlobalEvents';
import FieldRadius from './FieldRadius';
import GenerateProgressBar from './GenerateProgressBar';

export default class UI extends PIXI.Container {
    private muteButton: MuteButton;
    private generateButton: Button;
    private stopButton: Button;
    private fieldRadius: FieldRadius;
    private generateProgressBar: GenerateProgressBar;

    constructor() {
        super();

        this.init();
    }

    public onResize(): void {
        const width = window.innerWidth;
        const height = window.innerHeight;

        // this.muteButton.x = 100;
        // this.muteButton.y = 100;

        this.generateButton.x = width * 0.5;
        this.generateButton.y = height - 80;

        this.stopButton.x = width * 0.5;
        this.stopButton.y = height - 80;

        this.fieldRadius.x = width * 0.5;
        this.fieldRadius.y = 100;

        this.generateProgressBar.x = width * 0.5;
        this.generateProgressBar.y = height * 0.5;
    }

    private init(): void {
        // this.initMuteButton();
        this.initGenerateButton();
        this.initStopButton();
        this.initGenerateProgress();
        this.initFieldRadius();

        this.initSignals();
        this.initGlobalEvents();
    }

    private initMuteButton(): void {
        const muteButton = this.muteButton = new MuteButton();
        this.addChild(muteButton);
    }

    private initGenerateButton(): void {
        const texture = 'assets/button_rectangle_depth_gradient_green.png';
        const generateButton = this.generateButton = new Button(texture, 'Generate');
        this.addChild(generateButton);

        const text = generateButton.getText();
        text.y = -4;
    }

    private initStopButton(): void {
        const texture = 'assets/button_rectangle_depth_gradient_red.png';
        const stopButton = this.stopButton = new Button(texture, 'Stop');
        this.addChild(stopButton);

        const text = stopButton.getText();
        text.y = -4;
        stopButton.hide();
    }

    private initGenerateProgress(): void {
        const generateProgressBar = this.generateProgressBar = new GenerateProgressBar();
        this.addChild(generateProgressBar);

        generateProgressBar.hide();
    }

    private initFieldRadius(): void {
        const fieldRadius = this.fieldRadius = new FieldRadius();
        this.addChild(fieldRadius);
    }

    private initSignals(): void {
        this.generateButton.emitter.on('click', () => {
            GlobalEventBus.emit('game:generate');
        });

        this.stopButton.emitter.on('click', () => {
            GlobalEventBus.emit('game:stopGenerate');
        });
    }

    private initGlobalEvents(): void {
        GlobalEventBus.on('game:startGeneratingWorld', () => {
            this.generateProgressBar.show();
            this.generateProgressBar.setProgress(0);
            this.generateButton.hide();
            this.stopButton.show();
        });

        GlobalEventBus.on('game:progressGeneratingWorld', (progress: number) => {
            this.generateProgressBar.setProgress(progress);
        });

        GlobalEventBus.on('game:finishGeneratingWorld', () => {
            this.generateProgressBar.hide();
            this.generateButton.show();
            this.stopButton.hide();
        });
    }
}
