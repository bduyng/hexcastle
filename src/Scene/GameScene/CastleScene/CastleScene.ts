import * as THREE from 'three';
import { IHexTilesResult, IWFCStep } from '../../../Data/Interfaces/IWFC';
import { DefaultWFCConfig } from '../../../Data/Configs/WFCConfig';
import { HexWFC } from './HexWFC';
import HexTileInstance from './HexTile/HexTileInstance';
import { IHexCoord, IHexTileInstanceData, IHexTileTransform } from '../../../Data/Interfaces/IHexTile';
import DebugConfig from '../../../Data/Configs/Debug/DebugConfig';
import { TilesShowState } from '../../../Data/Enums/TilesShowState';
import EntropyView from './DebugViewHelpers/EntropyView';
import { GlobalEventBus } from '../../../Core/GlobalEvents';
import DebugGrid from './DebugViewHelpers/DebugGrid';
import { GameConfig } from '../../../Data/Configs/GameConfig';
import Intro from './Intro';
import FieldRadiusHelper from './FieldRadiusHelper';
import HexGridHelper from '../../../Helpers/HexGridHelper';

export default class CastleScene extends THREE.Group {

    private hexTileInstances: HexTileInstance[] = [];
    private steps: IWFCStep[] = [];
    private time: number = 0;
    private stepIndex: number = 0;
    private tilesShowState: TilesShowState = TilesShowState.NotReady;
    private entropyView: EntropyView;
    private hexWFC: HexWFC;
    private intro: Intro;
    private fieldRadiusHelper: FieldRadiusHelper;
    private previousGeneratePercent: number = 0;

    private isIntroActive: boolean = true;

    constructor() {
        super();

        this.init();
    }

    public update(dt: number): void {
        if (this.tilesShowState === TilesShowState.Ready || this.tilesShowState === TilesShowState.Showing) {
            this.tilesShowState = TilesShowState.Showing;
            this.time += dt;
            if (this.time >= GameConfig.gameField.showTilesDelay * 0.001) {
                this.time = 0;
                this.showTile(this.stepIndex);

                this.stepIndex++;

                if (this.stepIndex >= this.steps.length) {
                    this.tilesShowState = TilesShowState.Completed;
                }
            }
        }
    }

    public start(): void {
        this.intro.showByRadius(DefaultWFCConfig.radius);
    }

    private init(): void {
        this.initHexWFC();
        this.initIntro();
        this.initDebugGrid();
        this.initFieldRadiusHelper();

        this.initGlobalListeners();
    }

    private initHexWFC(): void {
        this.hexWFC = new HexWFC();
    }

    private initIntro(): void {
        const intro = this.intro = new Intro();
        this.add(intro);
    }

    private initDebugGrid(): void {
        if (DebugConfig.game.grid) {
            const debugGrid = new DebugGrid(DefaultWFCConfig.radius);
            this.add(debugGrid);
        }
    }

    private initFieldRadiusHelper(): void {
        const fieldRadiusHelper = this.fieldRadiusHelper = new FieldRadiusHelper();
        this.add(fieldRadiusHelper);
    }

    private generateTiles(): void {
        this.hexWFC.setConfig(DefaultWFCConfig);

        if (DefaultWFCConfig.radius <= GameConfig.WFC.syncGenerationRadius) {
            this.generateTilesSync();
        } else {
            this.generateTilesAsync();
        }
    }

    private generateTilesSync(): void {
        this.hexWFC.generate();

        const grid: IHexTilesResult[] = this.hexWFC.getGrid();
        this.steps = this.hexWFC.getSteps();

        this.initGridTiles(grid);
        this.initEntropyView();
    }

    private async generateTilesAsync(): Promise<void> {
        GlobalEventBus.emit('game:startGeneratingWorld');

        const stepsPerFrame = this.getStepsPerFrame(DefaultWFCConfig.radius);

        const result = await this.hexWFC.generateAsync(
            (stepIndex) => this.updateLoadingProgress(stepIndex),
            stepsPerFrame,
        );

        if (result.success === true) {
            this.steps = result.steps;
            this.initGridTiles(result.grid);
            this.initEntropyView();
        }

        GlobalEventBus.emit('game:finishGeneratingWorld');
        this.previousGeneratePercent = 0;
    }

    private getStepsPerFrame(radius: number): number {
        for (let i = 0; i < GameConfig.WFC.stepsPerFrame.values.length; i++) {
            const item = GameConfig.WFC.stepsPerFrame.values[i];
            if (radius <= item.radius) {
                return item.steps;
            }

        }

        return GameConfig.WFC.stepsPerFrame.minimum;
    }

    private updateLoadingProgress(stepIndex: number): void {
        const totalCells = HexGridHelper.getCountByRadius(DefaultWFCConfig.radius);
        const percentage = Math.round(stepIndex / totalCells * 100) / 100;

        if (this.previousGeneratePercent !== percentage) {
            GlobalEventBus.emit('game:progressGeneratingWorld', percentage);
        }

        this.previousGeneratePercent = percentage;
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
            // this.entropyView.drawStep(stepIndex);
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

    private resetScene(): void {
        this.tilesShowState = TilesShowState.NotReady;

        this.steps = [];
        this.time = 0;
        this.stepIndex = 0;

        this.hexTileInstances.forEach((hexTileInstance) => {
            hexTileInstance.reset();
            this.remove(hexTileInstance);
        });

        this.hexTileInstances = [];

        if (this.entropyView) {
            this.entropyView.reset();
            this.remove(this.entropyView);
            this.entropyView = null;
        }
    }

    private initGlobalListeners(): void {
        GlobalEventBus.on('game:generate', () => {
            if (this.isIntroActive) {
                this.intro.hide();
                this.isIntroActive = false;
            }

            this.resetScene();
            this.generateTiles();
        });

        GlobalEventBus.on('game:fieldRadiusChanged', (radius: number) => {
            DefaultWFCConfig.radius = radius;

            if (this.isIntroActive) {
                this.intro.showByRadius(DefaultWFCConfig.radius);
            } else {
                this.fieldRadiusHelper.show(DefaultWFCConfig.radius);
            }
        });

        GlobalEventBus.on('ui:sliderPointerUp', () => {
            if (!this.isIntroActive) {
                this.fieldRadiusHelper.hide();
            }
        });

        GlobalEventBus.on('ui:sliderPointerDown', () => {
            if (!this.isIntroActive) {
                this.fieldRadiusHelper.show(DefaultWFCConfig.radius);
            }
        });

        GlobalEventBus.on('game:stopGenerate', () => {
            this.hexWFC.stopGeneration();

            this.intro.show();
            this.intro.showByRadius(DefaultWFCConfig.radius);
            this.isIntroActive = true;
        });
    }
}
