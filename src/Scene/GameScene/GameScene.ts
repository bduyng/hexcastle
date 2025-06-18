import * as THREE from 'three';
import { ILibrariesData } from '../../Data/Interfaces/IBaseSceneData';
import DebugConfig from '../../Data/Configs/Debug/DebugConfig';
import TilesDebugDebug from './CastleScene/DebugViewHelpers/TilesDebugMode';
import CastleScene from './CastleScene/CastleScene';

export default class GameScene extends THREE.Group {
    private data: ILibrariesData;
    private castleScene: CastleScene;

    constructor(data: ILibrariesData) {
        super();

        this.data = data;

        this.init();
    }

    public update(dt: number): void { 
        if (this.castleScene) {
            this.castleScene.update(dt);
        }
    }

    private init(): void {
        if (DebugConfig.game.tilesDebugMode) {
            const tilesDebugMode = new TilesDebugDebug();
            this.add(tilesDebugMode);

            return;
        }

        this.initCastleScene();
    }

    private initCastleScene(): void {
        const castleScene = this.castleScene = new CastleScene();
        this.add(castleScene);
    }

}
