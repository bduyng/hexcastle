import * as THREE from 'three';
import { ILibrariesData } from '../Data/Interfaces/IBaseSceneData';
import UI from './UI/UI';
import GameScene from './GameScene/GameScene';

export default class MainScene {
    private data: ILibrariesData;
    private scene: THREE.Scene;
    private gameScene: GameScene;
    private ui: UI;

    constructor(data: ILibrariesData) {
        this.data = data;
        this.scene = data.scene;

        this.init();
    }

    public afterAssetsLoad(): void {
        this.scene.add(this.gameScene);
    }

    public update(dt: number): void {
        this.gameScene.update(dt);
    }

    public onResize(): void {
        this.ui.onResize();
    }

    private init(): void {
        this.gameScene = new GameScene(this.data);
        this.initUI();
    }

    private initUI(): void {
        const ui = this.ui = new UI();
        this.data.pixiApp.stage.addChild(ui);

        ui.onResize();
    }
}
