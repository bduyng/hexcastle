import * as PIXI from 'pixi.js';
import { NineSliceSprite } from 'pixi.js';

export default class Menu extends PIXI.Container {
    private textureName: string;
    private menuWidth: number;
    private menuHeight: number;

    constructor(textureName: string, width: number, height: number) {
        super();

        this.textureName = textureName;
        this.menuWidth = width;
        this.menuHeight = height;

        this.init();
    }

    private init(): void {
        this.initView();
    }

    private initView(): void {
        const texture = PIXI.Assets.get(this.textureName);
        const slice9 = new NineSliceSprite({
            texture: texture,
            leftWidth: 20,
            rightWidth: 20,
            topHeight: 20,
            bottomHeight: 20,
            width: this.menuWidth,
            height: this.menuHeight
        });
        this.addChild(slice9);
    }
}
