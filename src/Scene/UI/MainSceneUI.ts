import * as PIXI from 'pixi.js';
import Button from './UIObjects/Button';
import { GlobalEventBus } from '../../Core/GlobalEvents';

export default class MainSceneUI extends PIXI.Container {
    private generateButton: Button;

    constructor() {
        super();

        this.init();
    }

    public onResize(): void {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.generateButton.x = width * 0.5;
        this.generateButton.y = height - 100;
    }

    private init(): void {
        this.initGenerateButton();

        this.initSignals();
    }

    private initGenerateButton(): void {
        const texture = 'assets/button_rectangle_depth_gradient.png';
        const generateButton = this.generateButton = new Button(texture, 'Generate');
        this.addChild(generateButton);

        const text = generateButton.getText();
        text.y = -4;
    }

    private initSignals(): void {
        this.generateButton.emitter.on('click', () => {
            GlobalEventBus.emit('game:generate');
        });
    }
}
