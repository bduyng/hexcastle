import * as PIXI from 'pixi.js';
import Button from './UIObjects/Button';
import { GlobalEventBus } from '../../Core/GlobalEvents';
import Menu from './UIObjects/Menu';
import TextField from './UIObjects/TextField';

export default class MainSceneUI extends PIXI.Container {
    private generateButton: Button;
    private menu: Menu;

    constructor() {
        super();

        this.init();
    }

    public onResize(): void {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.generateButton.x = width * 0.5;
        this.generateButton.y = height - 100;

        // this.menu.x = width * 0.5;
        // this.menu.y = height * 0.5;
    }

    private init(): void {
        this.initGenerateButton();
        this.initMenu();

        this.initSignals();
    }

    private initGenerateButton(): void {
        const texture = 'assets/button_rectangle_depth_gradient.png';
        const generateButton = this.generateButton = new Button(texture, 'Generate');
        this.addChild(generateButton);

        const text = generateButton.getText();
        text.y = -4;
    }

    private initMenu(): void {
        // this.initMenuView();
        // this.initTextField();
    }

    private initMenuView(): void {
        const textureName = 'assets/button_rectangle_depth_flat.png';
        const menu = this.menu = new Menu(textureName, 200, 300);
        this.addChild(menu);
    }

    private initTextField(): void {
        const textField = new TextField('Radius:');
        this.menu.addChild(textField);

        textField.y = 30;
    }

    private initSignals(): void {
        this.generateButton.emitter.on('click', () => {
            GlobalEventBus.emit('game:generate');
        });
    }
}
