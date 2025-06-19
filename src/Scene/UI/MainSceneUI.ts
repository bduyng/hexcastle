import * as PIXI from 'pixi.js';
import Button from './UIObjects/Button';
import { GlobalEventBus } from '../../Core/GlobalEvents';
import Menu from './UIObjects/Menu';
import TextField from './UIObjects/TextField';
import Slider from './UIObjects/Slider';
import { SliderAssets, SliderOptions } from '../../Data/Interfaces/ISlider';

export default class MainSceneUI extends PIXI.Container {
    private generateButton: Button;
    private menu: Menu;
    private slider: Slider;

    constructor() {
        super();

        this.init();
    }

    public onResize(): void {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.generateButton.x = width * 0.5;
        this.generateButton.y = height - 100;

        this.slider.x = width * 0.5;
        this.slider.y = height * 0.5;

        // this.menu.x = width * 0.5;
        // this.menu.y = height * 0.5;
    }

    private init(): void {
        this.initGenerateButton();
        this.initMenu();
        this.initSlider();

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

    private initSlider(): void {
        const sliderAssets: SliderAssets = {
            background: 'assets/slide_horizontal_grey.png',
            thumb: 'assets/slide_hangle.png',
            track: 'assets/slide_horizontal_color.png'
        }

        const sliderOptions: SliderOptions = {
            min: 5,
            max: 20,
            step: 1,
            value: 5
        }

        const slider = this.slider = new Slider(sliderAssets, 300, sliderOptions);
        this.addChild(slider);
    }

    private initSignals(): void {
        this.generateButton.emitter.on('click', () => {
            GlobalEventBus.emit('game:generate');
        });
    }
}
