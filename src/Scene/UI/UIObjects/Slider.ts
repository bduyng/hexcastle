import * as PIXI from 'pixi.js';
import { Text, NineSliceSprite, TextStyle, Graphics } from 'pixi.js';
import { SliderAssets, SliderOptions } from '../../../Data/Interfaces/ISlider';

export default class Slider extends PIXI.Container {
    private assets: SliderAssets;
    private sliderWidth: number;
    private options: SliderOptions;
    private thumb: PIXI.Sprite;
    private track: NineSliceSprite;
    private trackMask: Graphics;
    private isPressed: boolean = false;

    constructor(assets: SliderAssets, width: number, options: SliderOptions) {
        super();

        this.assets = assets;
        this.sliderWidth = width;
        this.options = options;

        this.init();
    }

    public setValue(value: number): void {
        const offsetX: number = 6;
        const realWidth: number = this.sliderWidth - 14;
        const normalizedValue = (value - this.options.min) / (this.options.max - this.options.min);
        this.thumb.x = normalizedValue * realWidth + offsetX;

        this.trackMask.clear();
        this.trackMask.rect(0, 0, this.thumb.x, this.track.height)
            .fill({ color: 0xffffff })
    }

    private init(): void {
        this.initBackground();
        this.initMinMaxLabels();
        this.initTrack();
        this.initThumb();

        this.setValue(this.options.value);
    }

    private initBackground(): void {
        const texture = PIXI.Assets.get(this.assets.background);
        const background = new NineSliceSprite({
            texture: texture,
            leftWidth: 20,
            rightWidth: 20,
            topHeight: 0,
            bottomHeight: 0,
            width: this.sliderWidth,
        });
        this.addChild(background);
    }

    private initMinMaxLabels(): void {
        const offsetXMin: number = 9;
        const offsetXMax: number = 6;
        const offsetY: number = 30;
        const style = new TextStyle({
            fontFamily: 'kenneyfuture',
            fontSize: 16,
            fill: 0x000000,
            align: 'center',
        })

        const minLabel = new Text({
            text: this.options.min.toString(),
            style: style,
        });
        this.addChild(minLabel);

        minLabel.anchor.set(0.5);
        minLabel.x = offsetXMin;
        minLabel.y = offsetY;

        const maxLabel = new Text({
            text: this.options.max.toString(),
            style: style,
        });
        this.addChild(maxLabel);

        maxLabel.anchor.set(0.5);
        maxLabel.x = this.sliderWidth - offsetXMax;
        maxLabel.y = offsetY;
    }

    private initThumb(): void {
        const texture = PIXI.Assets.get(this.assets.thumb);
        const thumb = this.thumb = new PIXI.Sprite(texture);
        this.addChild(thumb);

        thumb.anchor.set(0.5);
        thumb.y = 5;

        thumb.eventMode = 'static';
        thumb.cursor = 'pointer';

        thumb.on('pointerdown', () => {
            this.isPressed = true;
        });

        thumb.on('pointerup', () => {
            this.isPressed = false;
        });

        thumb.on('pointermove', (event: PIXI.FederatedPointerEvent) => {
            if (this.isPressed) {
                const x = event.x;
                const localX = this.toLocal(new PIXI.Point(x, event.y)).x;
                const offsetX: number = 6;
                const realWidth: number = this.sliderWidth - 14;

                let normalizedValue = (localX - offsetX) / realWidth;
                normalizedValue = Math.round(normalizedValue / (this.options.step / (this.options.max - this.options.min))) * (this.options.step / (this.options.max - this.options.min));
                normalizedValue = Math.max(0, Math.min(1, normalizedValue));
                const value = Math.floor(this.options.min + normalizedValue * (this.options.max - this.options.min));
                this.setValue(value);
                console.log(value);
            }
        });
    }

    private initTrack(): void {
        const texture = PIXI.Assets.get(this.assets.track);
        const track = this.track = new NineSliceSprite({
            texture: texture,
            leftWidth: 20,
            rightWidth: 20,
            topHeight: 0,
            bottomHeight: 0,
            width: this.sliderWidth,
        });
        this.addChild(track);

        const mask = this.trackMask = new Graphics();
        mask.rect(0, 0, track.width, track.height)
            .fill({ color: 0xffffff })

        this.addChild(mask);
        track.mask = mask;
    }
}
