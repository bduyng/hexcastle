import * as PIXI from 'pixi.js';
import { Graphics } from 'pixi.js';
import TWEEN from 'three/addons/libs/tween.module.js';

export default class LoadingOverlay extends PIXI.Container {
    private view: Graphics;

    constructor() {
        super();

        this.init();
    }

    public hide(): void {
        new TWEEN.Tween(this.view)
            .to({ alpha: 0 }, 400)
            .easing(TWEEN.Easing.Linear.None)
            .start()
            .onComplete(() => {
                this.visible = false;
            });
    }

    private init(): void {
        const view = this.view = new Graphics();
        this.addChild(view);
        view.rect(0, 0, window.innerWidth, window.innerHeight)
            .fill({ color: 0x000000, alpha: 1 })
    }
}
