import * as PIXI from 'pixi.js';
import MuteButton from './UIObjects/MuteButton';

export default class UI extends PIXI.Container {
    private muteButton: MuteButton;

    constructor() {
        super();

        this.init();
    }

    public onResize(): void {
        this.muteButton.x = 100;
        this.muteButton.y = 100;
    }

    private init(): void {
        this.initMuteButton();
    }

    private initMuteButton(): void {
        const muteButton = this.muteButton = new MuteButton();
        this.addChild(muteButton);
    }
}
