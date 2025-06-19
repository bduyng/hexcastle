import * as PIXI from 'pixi.js';
import { Text, NineSliceSprite, TextStyle, Graphics } from 'pixi.js';
import { SliderAssets, SliderOptions } from '../../../Data/Interfaces/ISlider';
import mitt, { Emitter } from 'mitt';

type Events = {
    change: number;
};

export default class Slider extends PIXI.Container {
    public emitter: Emitter<Events> = mitt<Events>();

    private assets: SliderAssets;
    private sliderWidth: number;
    private options: SliderOptions;
    private thumb: PIXI.Sprite;
    private track: NineSliceSprite;
    private trackMask: Graphics;
    private isPressed: boolean = false;
    private currentValue: number;
    private wrapper: PIXI.Container;
    private globalPointerMove: ((event: PointerEvent) => void) | null = null;
    private globalPointerUp: ((event: PointerEvent) => void) | null = null;

    private thumbOffsetX: number = 6;
    private extraWidth: number = 14;

    constructor(assets: SliderAssets, width: number, options: SliderOptions) {
        super();

        this.assets = assets;
        this.sliderWidth = width;
        this.options = options;
        this.currentValue = options.value;

        this.init();
    }

    public setValue(value: number): void {
        const normalizedValue = (value - this.options.min) / (this.options.max - this.options.min);
        this.thumb.x = normalizedValue * (this.sliderWidth - this.extraWidth) + this.thumbOffsetX;

        this.trackMask.clear();
        this.trackMask.rect(0, 0, this.thumb.x, this.track.height)
            .fill({ color: 0xffffff });
        
        this.currentValue = value;
    }

    public getValue(): number {
        return this.currentValue;
    }

    private init(): void {
        this.wrapper = new PIXI.Container();
        this.addChild(this.wrapper);

        this.initBackground();
        this.initMinMaxLabels();
        this.initTrack();
        this.initThumb();

        this.wrapper.x = -this.sliderWidth * 0.5;
        this.wrapper.y = -this.thumb.height * 0.5;

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
        this.wrapper.addChild(background);
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
        this.wrapper.addChild(minLabel);

        minLabel.anchor.set(0.5);
        minLabel.x = offsetXMin;
        minLabel.y = offsetY;

        const maxLabel = new Text({
            text: this.options.max.toString(),
            style: style,
        });
        this.wrapper.addChild(maxLabel);

        maxLabel.anchor.set(0.5);
        maxLabel.x = this.sliderWidth - offsetXMax;
        maxLabel.y = offsetY;
    }

    private initThumb(): void {
        const texture = PIXI.Assets.get(this.assets.thumb);
        const thumb = this.thumb = new PIXI.Sprite(texture);
        this.wrapper.addChild(thumb);

        thumb.anchor.set(0.5);
        thumb.y = 5;

        thumb.eventMode = 'static';
        thumb.cursor = 'pointer';

        thumb.on('pointerdown', (event: PIXI.FederatedPointerEvent) => {
            this.isPressed = true;
            
            this.addGlobalEventListeners();
            event.stopPropagation();
        });
    }

    private addGlobalEventListeners(): void {
        const onGlobalPointerMove = (event: PointerEvent) => {
            if (this.isPressed) {
                const canvas = document.querySelector('.pixi-canvas') as HTMLCanvasElement;
                if (!canvas) return;
                
                const rect = canvas.getBoundingClientRect();
                const canvasX = event.clientX - rect.left;
                const canvasY = event.clientY - rect.top;
                const globalPoint = new PIXI.Point(canvasX + this.wrapper.width * 0.5, canvasY);
                const localPoint = this.toLocal(globalPoint);

                let normalizedValue = (localPoint.x - this.thumbOffsetX) / (this.sliderWidth - this.extraWidth);
                normalizedValue = Math.round(normalizedValue / (this.options.step / (this.options.max - this.options.min))) * (this.options.step / (this.options.max - this.options.min));
                normalizedValue = Math.max(0, Math.min(1, normalizedValue));
                const value = Math.floor(this.options.min + normalizedValue * (this.options.max - this.options.min));

                if (value !== this.currentValue) {
                    this.setValue(value);
                    this.emitter.emit('change', value);
                }
            }
        };

        const onGlobalPointerUp = () => {
            this.isPressed = false;
            this.removeGlobalEventListeners();
        };

        this.globalPointerMove = onGlobalPointerMove;
        this.globalPointerUp = onGlobalPointerUp;

        document.addEventListener('pointermove', onGlobalPointerMove);
        document.addEventListener('pointerup', onGlobalPointerUp);
    }

    private removeGlobalEventListeners(): void {
        if (this.globalPointerMove) {
            document.removeEventListener('pointermove', this.globalPointerMove);
            this.globalPointerMove = null;
        }
        if (this.globalPointerUp) {
            document.removeEventListener('pointerup', this.globalPointerUp);
            this.globalPointerUp = null;
        }
    }

    public destroy(): void {
        this.removeGlobalEventListeners();
        super.destroy();
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
        this.wrapper.addChild(track);

        const mask = this.trackMask = new Graphics();
        mask.rect(0, 0, track.width, track.height)
            .fill({ color: 0xffffff })

        this.wrapper.addChild(mask);
        track.mask = mask;
    }
}
