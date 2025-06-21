import * as THREE from 'three';
import { ILibrariesData } from '../../Data/Interfaces/IBaseSceneData';
import DebugConfig from '../../Data/Configs/Debug/DebugConfig';
import TilesDebugDebug from './CastleScene/DebugViewHelpers/TilesDebugMode';
import CastleScene from './CastleScene/CastleScene';
import CameraController from './CameraController';

export default class GameScene extends THREE.Group {
    private data: ILibrariesData;
    private castleScene: CastleScene;
    private cameraController: CameraController;

    constructor(data: ILibrariesData) {
        super();

        this.data = data;

        this.init();
    }

    public update(dt: number): void {
        this.castleScene.update(dt);
        this.cameraController.update();
    }

    public start(): void {
        this.castleScene.start();
    }

    private init(): void {
        this.initCameraController();

        if (DebugConfig.game.tilesDebugMode) {
            this.initTilesDebugMode();
        } else {
            this.initCastleScene();
        }
    }

    private initCameraController(): void {
        const cameraController = this.cameraController = new CameraController(this.data.camera);
        this.add(cameraController);
    }

    private initTilesDebugMode(): void {
        const tilesDebugMode = new TilesDebugDebug();
        this.add(tilesDebugMode);
    }

    private initCastleScene(): void {
        const castleScene = this.castleScene = new CastleScene();
        this.add(castleScene);
    }

}
