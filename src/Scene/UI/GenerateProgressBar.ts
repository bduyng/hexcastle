import * as PIXI from 'pixi.js';
import { Text, NineSliceSprite, Graphics } from 'pixi.js';

export default class GenerateProgressBar extends PIXI.Container {
    private progress: Text;
    private progressBar: NineSliceSprite;
    private progressBarMask: Graphics;
    private progressBarWidth: number = 315;

    constructor() {
        super();

        this.init();
    }

    public show(): void {
        this.visible = true;
    }

    public hide(): void {
        this.visible = false;
    }

    public setProgress(progress: number): void {
        const normalizedProgress = Math.min(Math.max(progress, 0), 1);
        this.progress.text = `${Math.round(normalizedProgress * 100)}%`;

        this.progressBarMask.clear();
        this.progressBarMask.rect(0, 0, normalizedProgress * this.progressBarWidth, this.progressBar.height)
            .fill({ color: 0xffffff });
    }

    private init(): void {
        this.initCaption();
        this.initProgress()
        this.initProgressBar();
    }

    private initCaption(): void {
        const caption = new Text({
            text: 'Generating world:',
            style: {
                fontFamily: 'kenneyfuture',
                fontSize: 20,
                fill: 0x000000,
                align: 'center',
            },
        });
        this.addChild(caption);
        caption.anchor.set(0.5);

        caption.x = -26;
        caption.y = -11;
    }

    private initProgress(): void {
        const progress = this.progress = new Text({
            text: '0%',
            style: {
                fontFamily: 'kenneyfuture',
                fontSize: 20,
                fill: 0x000000,
                align: 'left',
            },
        });
        this.addChild(progress);
        progress.anchor.set(0, 0.5);

        progress.x = 106;
        progress.y = -11;
    }

    private initProgressBar(): void {
        const progressBarContainer = new PIXI.Container();
        this.addChild(progressBarContainer);

        const texture = PIXI.Assets.get('assets/progress_bar.png');
        const progressBar = this.progressBar = new NineSliceSprite({
            texture: texture,
            leftWidth: 20,
            rightWidth: 20,
            topHeight: 0,
            bottomHeight: 0,
            width: this.progressBarWidth,
        });
        progressBarContainer.addChild(progressBar);

        progressBarContainer.x = -progressBar.width * 0.5;
        progressBarContainer.y = 11;

        const mask = this.progressBarMask = new Graphics();
        mask.rect(0, 0, progressBar.width, progressBar.height)
            .fill({ color: 0xffffff })

        progressBarContainer.addChild(mask);
        progressBar.mask = mask;
    }
}
