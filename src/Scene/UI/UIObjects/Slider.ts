import * as PIXI from 'pixi.js';

interface SliderAssets {
    background: string;
    thumb: string;
    track: string;
}

interface SliderOptions {
    min: number;
    max: number;
    step: number;
    value: number;
}

export default class Slider extends PIXI.Container {
    private assets: SliderAssets;
    private sliderWidth: number;
    private options: SliderOptions;

    constructor(assets: SliderAssets, width: number, options: SliderOptions) {
        super();

        this.assets = assets;
        this.sliderWidth = width;
        this.options = options;

        this.init();
    }

    private init(): void {

    }
}
