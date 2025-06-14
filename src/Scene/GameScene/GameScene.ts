import * as THREE from 'three';
import { ILibrariesData } from '../../Data/Interfaces/IBaseSceneData';
import DebugConfig from '../../Data/Configs/Debug/DebugConfig';
import DebugGrid from './CastleScene/DebugViewHelpers/DebugGrid';
import EdgesDebug from './CastleScene/DebugViewHelpers/EdgesDebug';
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
        if (DebugConfig.game.edgesDebugMode) {
            const edgesDebug = new EdgesDebug();
            this.add(edgesDebug);

            return;
        }

        this.initCastleScene();
        this.initDebugGrid();
    }

    private initCastleScene(): void {
        const castleScene = this.castleScene = new CastleScene();
        this.add(castleScene);
    }

    private initDebugGrid(): void {
        if (DebugConfig.game.grid.enabled) {
            const debugGrid = new DebugGrid(DebugConfig.game.grid.radius);
            this.add(debugGrid);
        }
    }

}
