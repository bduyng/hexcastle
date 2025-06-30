import * as THREE from 'three';
import { ILibrariesData } from '../../Data/Interfaces/IBaseSceneData';
import TilesDebugMode from './CastleScene/DebugViewHelpers/TilesDebugMode';
import CastleScene from './CastleScene/CastleScene';
import CameraController from './CameraController';
import { DebugGameConfig } from '../../Data/Configs/Debug/DebugConfig';
import { GlobalEventBus } from '../../Core/GlobalEvents';
import { DefaultWFCConfig } from '../../Data/Configs/WFCConfig';

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
        if (dt > 0.1) {
            dt = 0.1;
        }

        if (this.castleScene) {
            this.castleScene.update(dt);
        }

        this.cameraController.update(dt);
    }

    public start(): void {
        if (!DebugGameConfig.tilesDebugMode) {
            this.castleScene.start();
        }   
    }

    private init(): void {
        this.initCameraController();

        if (DebugGameConfig.tilesDebugMode) {
            this.initTilesDebugMode();
        } else {
            this.initCastleScene();
            this.initGlobalListeners();
        }
    }

    private initCameraController(): void {
        const cameraController = this.cameraController = new CameraController(this.data.camera);
        this.add(cameraController);
    }

    private initTilesDebugMode(): void {
        const tilesDebugMode = new TilesDebugMode();
        this.add(tilesDebugMode);
    }

    private initCastleScene(): void {
        const castleScene = this.castleScene = new CastleScene(this.data);
        this.add(castleScene);
    }

    private initGlobalListeners(): void {
        GlobalEventBus.on('game:generateStarted', () => this.cameraController.moveForTargetRadius(DefaultWFCConfig.radius));
    }

}
