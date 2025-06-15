import * as THREE from 'three';
import { IHexTilesResult, IWFCStep } from '../../../Data/Interfaces/IWFC';
import { DefaultWFCConfig, ShowTilesConfig } from '../../../Data/Configs/WFCConfig';
import { HexWFC } from './HexWFC';
import HexTileInstance from './HexTile/HexTileInstance';
import { IHexCoord, IHexTileInstanceData, IHexTileTransform } from '../../../Data/Interfaces/IHexTile';
import DebugConfig from '../../../Data/Configs/Debug/DebugConfig';
import { TilesShowState } from '../../../Data/Enums/TilesShowState';
import EntropyView from './DebugViewHelpers/EntropyView';

export default class CastleScene extends THREE.Group {

    private hexTileInstances: HexTileInstance[] = [];
    private steps: IWFCStep[] = [];
    private time: number = 0;
    private stepIndex: number = 0;
    private tilesShowState: TilesShowState = TilesShowState.NotReady;
    private entropyView: EntropyView;

    constructor() {
        super();

        this.init();
    }

    public update(dt: number): void {
        if (this.tilesShowState === TilesShowState.Ready || this.tilesShowState === TilesShowState.Showing) {
            this.tilesShowState = TilesShowState.Showing;
            this.time += dt;
            if (this.time >= ShowTilesConfig.delay * 0.001) {
                this.time = 0;
                this.showTile(this.stepIndex);

                this.stepIndex++;

                if (this.stepIndex >= this.steps.length) {
                    this.tilesShowState = TilesShowState.Completed;
                }
            }
        }
    }

    private init(): void {
        this.initHexWFC();
    }

    private initHexWFC(): void {
        const wfc = new HexWFC(DefaultWFCConfig);
        const success: boolean = wfc.generate();

        if (success) {
            const grid: IHexTilesResult[] = wfc.getGrid();
            this.steps = wfc.getSteps();

            this.initGridTiles(grid);
            this.initEntropyView();
        } else {
            console.error('Failed to generate grid');
        }
    }

    private initGridTiles(grid: IHexTilesResult[]): void {
        const hexTileInstancesData: IHexTileInstanceData[] = this.convertToHexTileInstanceData(grid);

        for (let i = 0; i < hexTileInstancesData.length; i++) {
            const hexTileInstance = new HexTileInstance(hexTileInstancesData[i], DebugConfig.game.hexTileDebug);
            this.add(hexTileInstance);

            this.hexTileInstances.push(hexTileInstance);
        }

        this.showPredefinedTiles();

        this.tilesShowState = TilesShowState.Ready;
    }

    private initEntropyView(): void {
        if (DebugConfig.game.entropy) {
            const entropyView = this.entropyView = new EntropyView(this.steps, DefaultWFCConfig.radius);
            this.add(entropyView);
        }
    }

    private showPredefinedTiles(): void {
        const predefinedTiles = DefaultWFCConfig.predefinedTiles;
        for (let i = 0; i < predefinedTiles.length; i++) {
            const hexTileInstance = this.findHexTileInstanceByPosition(predefinedTiles[i].coord);
            if (hexTileInstance) {
                hexTileInstance.showTile(predefinedTiles[i].coord);
            }
        }
    }

    private showTile(stepIndex: number): void {
        const step: IWFCStep = this.steps[stepIndex];
        if (step.newTile) {
            const hexTileInstance = this.findHexTileInstanceByPosition(step.newTile.position);
            if (hexTileInstance) {
                hexTileInstance.showTile(step.newTile.position);
            }
        }

        if (DebugConfig.game.entropy) {
            this.entropyView.drawStep(stepIndex);
        }
    }

    private convertToHexTileInstanceData(grid: IHexTilesResult[]): IHexTileInstanceData[] {
        const hexTileInstancesData: IHexTileInstanceData[] = [];
        grid.forEach((hexTileResult) => {
            const hexTileTransform: IHexTileTransform = {
                position: hexTileResult.position,
                rotation: hexTileResult.rotation,
            };

            const existingType = hexTileInstancesData.find((item) => item.type === hexTileResult.type);
            if (existingType) {
                existingType.transforms.push(hexTileTransform);
            } else {
                hexTileInstancesData.push({
                    type: hexTileResult.type,
                    transforms: [hexTileTransform],
                });
            }
        });

        return hexTileInstancesData;
    }

    private findHexTileInstanceByPosition(position: IHexCoord): HexTileInstance {
        return this.hexTileInstances.find(hexTileInstance => hexTileInstance.hasTileByPosition(position));
    }
}
