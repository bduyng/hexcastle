import * as PIXI from 'pixi.js';
import MuteButton from './UIObjects/MuteButton';
import MainSceneUI from './MainSceneUI';

export default class UI extends PIXI.Container {
    private muteButton: MuteButton;
    private mainSceneUI: MainSceneUI;

    constructor() {
        super();

        this.init();
    }

    public onResize(): void {
        this.muteButton.x = 100;
        this.muteButton.y = 100;

        this.mainSceneUI.onResize();
    }

    private init(): void {
        this.initMainSceneUI();
        this.initMuteButton();
    }

    private initMainSceneUI(): void {
        const mainSceneUI = this.mainSceneUI = new MainSceneUI();
        this.addChild(mainSceneUI);
    }

    private initMuteButton(): void {
        const muteButton = this.muteButton = new MuteButton();
        this.addChild(muteButton);
    }
}
