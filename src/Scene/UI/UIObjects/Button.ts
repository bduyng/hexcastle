import * as PIXI from 'pixi.js';
import { Text } from 'pixi.js';
import TWEEN from 'three/addons/libs/tween.module.js';
import mitt, { Emitter } from 'mitt';

type Events = {
    click: string;
};

export default class Button extends PIXI.Container {
    private isPressed: boolean;
    private textureName: string;
    private textString: string;
    private text: Text;

    public emitter: Emitter<Events> = mitt<Events>();

    constructor(textureName: string, textString: string = '') {
        super();

        this.textureName = textureName;
        this.textString = textString;

        this.isPressed = false;

        this.init();
    }

    public getText(): Text {
        return this.text;
    }

    public show(): void {
        this.visible = true;
    }

    public hide(): void {
        this.visible = false;
    }

    private init(): void {
        this.initView();
        this.initText();
    }

    private initView(): void {
        const texture = PIXI.Assets.get(this.textureName);
        const view = new PIXI.Sprite(texture);
        this.addChild(view);

        view.anchor.set(0.5);

        view.eventMode = 'static';
        view.cursor = 'pointer';

        view.on('pointerdown', () => {
            this.isPressed = true;
            this.onScaleIn();
        });

        view.on('pointerup', () => {
            this.isPressed = false;
            this.emitter.emit('click');
            this.onScaleOut();
        });

        view.on('pointerout', () => {
            if (this.isPressed) {
                this.isPressed = false;
                this.onScaleOut();
            }
        });
    }

    private initText(): void {
        if (this.textString) {
            const text = this.text = new Text({
                text: this.textString,
                style: {
                    fontFamily: 'kenneyfuture',
                    fontSize: 23,
                    fill: 0x000000,
                },
            });

            text.anchor.set(0.5);
            this.addChild(text);
        }
    }

    private onScaleIn(): void {
        new TWEEN.Tween(this.scale)
            .to({ x: 0.97, y: 0.97 }, 100)
            .easing(TWEEN.Easing.Sinusoidal.In)
            .start();
    }

    private onScaleOut(): void {
        new TWEEN.Tween(this.scale)
            .to({ x: 1, y: 1 }, 100)
            .easing(TWEEN.Easing.Sinusoidal.Out)
            .start();
    }
}
