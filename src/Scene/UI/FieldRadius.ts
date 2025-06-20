import * as PIXI from 'pixi.js';
import { Text } from 'pixi.js';
import Slider from './UIObjects/Slider';
import { SliderAssets, SliderOptions } from '../../Data/Interfaces/ISlider';
import { GlobalEventBus } from '../../Core/GlobalEvents';
import { GameConfig } from '../../Data/Configs/GameConfig';

export default class FieldRadius extends PIXI.Container {
    private slider: Slider;
    private radiusValue: Text;

    constructor() {
        super();

        this.init();
    }

    private init(): void {
        this.initCaption();
        this.initSlider();
        this.initRadiusValue();

        this.initSignals();
    }

    private initCaption(): void {
        const caption = new Text({
            text: 'Field radius:',
            style: {
                fontFamily: 'kenneyfuture',
                fontSize: 21,
                fill: 0x000000,
                align: 'center',
            },
        });

        this.addChild(caption);

        caption.anchor.set(0.5);
        caption.x = -18;
        caption.y = -42;
    }

    private initRadiusValue(): void {
        const value = this.slider.getValue();

        const radiusValue = this.radiusValue = new Text({
            text: `${value}`,
            style: {
                fontFamily: 'kenneyfuture',
                fontSize: 32,
                fill: 0x000000,
                align: 'left',
            },
        });

        this.addChild(radiusValue);

        radiusValue.anchor.set(0, 0.5);
        radiusValue.y = -43;
        radiusValue.x = 80;
    }

    private initSlider(): void {
        const sliderAssets: SliderAssets = {
            background: 'assets/slide_horizontal_grey.png',
            thumb: 'assets/slide_hangle.png',
            track: 'assets/slide_horizontal_color.png'
        }

        const sliderOptions: SliderOptions = {
            min: GameConfig.gameField.radius.min,
            max: GameConfig.gameField.radius.max,
            step: 1,
            value: GameConfig.gameField.radius.default,
        }

        const slider = this.slider = new Slider(sliderAssets, 300, sliderOptions);
        this.addChild(slider);
    }

    private initSignals(): void {
        this.slider.emitter.on('change', (value: number) => {
            this.radiusValue.text = `${value}`;
            GlobalEventBus.emit('game:fieldRadiusChanged', value);
        });

        this.slider.emitter.on('pointerDown', () => {
            GlobalEventBus.emit('ui:sliderPointerDown');
        });

        this.slider.emitter.on('pointerUp', () => {
            GlobalEventBus.emit('ui:sliderPointerUp');
        });
    }
}
