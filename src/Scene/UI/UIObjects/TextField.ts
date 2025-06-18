import * as PIXI from 'pixi.js';
import { Text, NineSliceSprite } from 'pixi.js';

export default class TextField extends PIXI.Container {
    private caption: string;
    private fieldContainer: PIXI.Container;
    private fieldView: PIXI.NineSliceSprite;
    private fieldText: Text;

    private menuWidth: number = 200;
    private marginX: number = 10;
    private textFieldMarginX: number = 14;

    constructor(caption: string) {
        super();

        this.caption = caption;

        this.init();
    }

    public setText(text: string): void {
        this.fieldText.text = text;
        this.fieldText.x = -this.fieldView.width * 0.5 + this.textFieldMarginX;
    }

    private init(): void {
        this.initCaption();
        this.initField();
    }

    private initCaption(): void {
        const text = new Text({
            text: this.caption,
            style: {
                fontFamily: 'kenneyfuture',
                fontSize: 18,
                fill: 0x000000,
            },
        });

        text.anchor.set(0, 0.5);
        this.addChild(text);

        text.x = this.marginX;
    }

    private initField(): void {
        this.fieldContainer = new PIXI.Container();
        this.addChild(this.fieldContainer);

        this.initFieldView();
        this.initFieldText();

        this.fieldContainer.x = this.menuWidth - this.fieldContainer.width * 0.5 - this.marginX;
    }

    private initFieldView(): void {
        const width = 80;
        const height = 40;

        const textureName = 'assets/button_rectangle_line.png';
        const texture = PIXI.Assets.get(textureName);
        const fieldView = this.fieldView = new NineSliceSprite({
            texture: texture,
            leftWidth: 5,
            rightWidth: 5,
            topHeight: 5,
            bottomHeight: 5,
            width: width,
            height: height
        });
        this.fieldContainer.addChild(fieldView);

        fieldView.y = -height * 0.5;
        fieldView.x = -width * 0.5;
    }

    private initFieldText(): void {
        const fieldText = this.fieldText = new Text({
            text: '10',
            style: {
                fontFamily: 'kenneyfuture',
                fontSize: 18,
                fill: 0x000000,
            },
        });
        this.fieldContainer.addChild(fieldText);

        fieldText.anchor.set(0, 0.5);
        fieldText.x = -this.fieldView.width * 0.5 + this.textFieldMarginX;
    }
}
