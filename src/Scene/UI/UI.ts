import * as PIXI from 'pixi.js';
import MuteButton from './UIObjects/MuteButton';
import Button from './UIObjects/Button';
import { GlobalEventBus } from '../../Core/GlobalEvents';
import FieldRadius from './FieldRadius';

export default class UI extends PIXI.Container {
    private muteButton: MuteButton;
    private generateButton: Button;
    private fieldRadius: FieldRadius;

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

        this.fieldRadius.x = width * 0.5;
        this.fieldRadius.y = 100;
    }

    private init(): void {
        // this.initMuteButton();
        this.initGenerateButton();
        this.initFieldRadius();

        this.initSignals();
    }

    private initMuteButton(): void {
        const muteButton = this.muteButton = new MuteButton();
        this.addChild(muteButton);
    }

    private initGenerateButton(): void {
        const texture = 'assets/button_rectangle_depth_gradient.png';
        const generateButton = this.generateButton = new Button(texture, 'Generate');
        this.addChild(generateButton);

        const text = generateButton.getText();
        text.y = -4;
    }

    private initFieldRadius(): void {
        const fieldRadius = this.fieldRadius = new FieldRadius();
        this.addChild(fieldRadius);
    }

    private initSignals(): void {
        this.generateButton.emitter.on('click', () => {
            GlobalEventBus.emit('game:generate');
        });
    }
}
