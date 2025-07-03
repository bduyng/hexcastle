import GUIHelper from "../../Core/DebugMenu/GUIHelper";
import { GlobalEventBus } from "../../Core/GlobalEvents";
import { DebugConfig, DebugGameConfig } from "../../Data/Configs/Debug/DebugConfig";
import { GameConfig } from "../../Data/Configs/GameConfig";
import { GenerateEntityType } from "../../Data/Enums/GenerateEntityType";

export default class GameDebugMenu {

    constructor() {

        this.init();
    }

    private init(): void {
        this.initGeneralFolder();
        this.initSceneFolder();
    }

    private initGeneralFolder(): void {
        const generalFolder = GUIHelper.getGui().addFolder({
            title: 'General',
            expanded: false,
        });

        generalFolder.addInput(DebugConfig, 'fpsMeter', {
            label: 'FPS meter',
        }).on('change', () => {
            GlobalEventBus.emit('debug:fpsMeterChanged');
        });

        generalFolder.addInput(DebugConfig, 'rendererStats', {
            label: 'Renderer stats',
        }).on('change', () => {
            GlobalEventBus.emit('debug:rendererStatsChanged');
        });
    }

    private initSceneFolder(): void {
        const sceneFolder = GUIHelper.getGui().addFolder({
            title: 'Scene',
            // expanded: false,
        });

        sceneFolder.addInput(DebugGameConfig, 'grid', {
            label: 'Grid',
        }).on('change', () => {
            GlobalEventBus.emit('debug:gridChanged');
        });

        sceneFolder.addInput(GameConfig.gameField, 'hexSize', {
            label: 'Hex size',
            min: 1.15,
            max: 2,
        });

        // sceneFolder.addInput(GameConfig.gameField.radius, 'max', {
        //     label: 'Field radius max',
        //     min: 20,
        //     max: 50,
        //     step: 1,
        // }).on('change', () => {
        //     GlobalEventBus.emit('debug:fieldRadiusChanged');
        // });

        sceneFolder.addSeparator();

        sceneFolder.addInput(GameConfig.gameField, 'showTilesTimeScale', {
            label: 'Show time scale',
            min: 0.1,
            max: 5,
        });

        sceneFolder.addInput(DebugGameConfig, 'showInstantly', {
            label: 'Show instantly',
        });

        this.initLandscapeFolder(sceneFolder);
    }

    private initLandscapeFolder(folder: any): void {
        const landscapeFolder = folder.addFolder({
            title: 'Landscape Layer',
            // expanded: false,
        });

        landscapeFolder.addInput(DebugGameConfig.generateType[GenerateEntityType.Landscape], 'show', {
            label: 'Visible',
        }).on('change', () => {
            GlobalEventBus.emit('debug:landscapeShow');
        });

        landscapeFolder.addInput(DebugGameConfig.generateType[GenerateEntityType.Landscape], 'entropy', {
            label: 'Show entropy',
        }).on('change', () => {
            GlobalEventBus.emit('debug:entropyChanged');
        });

        landscapeFolder.addInput(DebugGameConfig.generateType[GenerateEntityType.Landscape].hexTileDebug, 'rotationAndEdge', {
            label: 'Show tile rotation',
        }).on('change', () => {
            GlobalEventBus.emit('debug:landscapeRotationChanged');
        });
    }
}
