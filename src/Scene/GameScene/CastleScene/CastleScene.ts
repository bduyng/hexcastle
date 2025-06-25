import * as THREE from 'three';
import { IHexTilesResult, INewTileStep } from '../../../Data/Interfaces/IWFC';
import { DefaultWFCConfig } from '../../../Data/Configs/WFCConfig';
import { HexWFC } from './HexWFC';
import HexTileInstance from './HexTile/HexTileInstance';
import { IHexCoord, IHexTileInstanceData, IHexTileTransform } from '../../../Data/Interfaces/IHexTile';
import { TilesShowState } from '../../../Data/Enums/TilesShowState';
import EntropyHelper from './DebugViewHelpers/EntropyHelper';
import { GlobalEventBus } from '../../../Core/GlobalEvents';
import DebugGrid from './DebugViewHelpers/DebugGrid';
import { GameConfig } from '../../../Data/Configs/GameConfig';
import Intro from './Intro';
import FieldRadiusHelper from './FieldRadiusHelper';
import HexGridHelper from '../../../Helpers/HexGridHelper';
import { WallGenerator } from './WallGenerator';
import { IWallConfig } from '../../../Data/Interfaces/IWall';
import { GenerateEntityType } from '../../../Data/Enums/GenerateEntityType';
import { DebugGameConfig } from '../../../Data/Configs/Debug/DebugConfig';
import { GenerateEntityOrder } from '../../../Data/Configs/GenerateEntityConfig';

export default class CastleScene extends THREE.Group {

    private hexTileInstances: { [key in GenerateEntityType]?: HexTileInstance[] } = {};
    private steps: { [key in GenerateEntityType]?: INewTileStep[] } = {};
    private time: number = 0;
    private stepIndex: number = 0;
    private tilesShowState: TilesShowState = TilesShowState.NotReady;
    private entropyHelper: EntropyHelper;
    private hexWFC: HexWFC;
    private wallGenerator: WallGenerator;
    private intro: Intro;
    private fieldRadiusHelper: FieldRadiusHelper;
    private showingEntityType: GenerateEntityType;
    private showingEntityIndex: number = 0;
    private previousGeneratePercent: number = 0;
    private showTileStepTime: number = 0;
    private needAsyncGenerate: boolean = false;
    private generatingStopped: boolean = false;

    private isIntroActive: boolean = true;

    constructor() {
        super();

        this.init();
    }

    public update(dt: number): void {
        if (this.tilesShowState === TilesShowState.Ready || this.tilesShowState === TilesShowState.Showing) {
            this.tilesShowState = TilesShowState.Showing;
            this.time += dt;

            if (this.time >= this.showTileStepTime / 1000) {
                const stepsToShow = Math.floor(this.time * 1000 / this.showTileStepTime);
                this.time -= (this.showTileStepTime / 1000) * stepsToShow;

                this.showTiles(this.stepIndex, stepsToShow, this.showingEntityType);
                this.stepIndex += stepsToShow;
            }
        }

        if (this.tilesShowState === TilesShowState.CompleteEntity) {
            this.afterShowGenerateEntity();
        }
    }

    public start(): void {
        this.intro.showByRadius(DefaultWFCConfig.radius);
    }

    private init(): void {
        this.initHexWFC();
        this.initWallGenerator();
        this.initIntro();
        this.initDebugGrid();
        this.initFieldRadiusHelper();
        this.initStartData();
        this.initEntropyHelper();

        this.initGlobalListeners();
    }

    private initHexWFC(): void {
        this.hexWFC = new HexWFC();
    }

    private initWallGenerator(): void {
        this.wallGenerator = new WallGenerator();
    }

    private initIntro(): void {
        const intro = this.intro = new Intro();
        this.add(intro);
    }

    private initDebugGrid(): void {
        if (DebugGameConfig.grid) {
            const debugGrid = new DebugGrid(DefaultWFCConfig.radius);
            this.add(debugGrid);
        }
    }

    private initFieldRadiusHelper(): void {
        const fieldRadiusHelper = this.fieldRadiusHelper = new FieldRadiusHelper();
        this.add(fieldRadiusHelper);
    }

    private initStartData(): void {
        for (const generateType in GenerateEntityType) {
            const type = GenerateEntityType[generateType as keyof typeof GenerateEntityType];
            this.hexTileInstances[type] = [];
            this.steps[type] = [];
        }
    }

    private async generateLandscapeTiles(): Promise<void> {
        this.hexWFC.setConfig(DefaultWFCConfig);

        if (this.needAsyncGenerate) {
            await this.generateLandscapeTilesAsync();
        } else {
            this.generateLandscapeTilesSync();
        }

        this.entropyHelper?.setData(this.steps[GenerateEntityType.Landscape], DefaultWFCConfig.radius);
    }

    private generateLandscapeTilesSync(): void {
        this.hexWFC.generate();

        this.steps[GenerateEntityType.Landscape] = this.hexWFC.getSteps();;

        const tiles: IHexTilesResult[] = this.hexWFC.getTiles();
        this.createTiles(tiles, GenerateEntityType.Landscape);
    }

    private async generateLandscapeTilesAsync(): Promise<void> {
        GlobalEventBus.emit('game:startGeneratingWorld');

        const stepsPerFrame = this.getStepsPerFrame(DefaultWFCConfig.radius);

        const result = await this.hexWFC.generateAsync(
            (stepIndex) => this.updateLoadingProgress(stepIndex),
            stepsPerFrame,
        );

        if (result.success) {
            this.steps[GenerateEntityType.Landscape] = this.hexWFC.getSteps();
            this.createTiles(result.grid, GenerateEntityType.Landscape);
        }

        GlobalEventBus.emit('game:finishGeneratingWorld');
        this.previousGeneratePercent = 0;
    }

    private generateWall(): void {
        if (this.generatingStopped) {
            return;
        }

        const wallConfig: IWallConfig = {
            center: { q: 0, r: 0 },
            radius: 3,
            maxOffset: 2,
        };

        this.wallGenerator.generate(wallConfig);
        this.steps[GenerateEntityType.Walls] = this.wallGenerator.getSteps();

        const wallTiles: IHexTilesResult[] = this.wallGenerator.getTiles();
        this.createTiles(wallTiles, GenerateEntityType.Walls);
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

    private createTiles(tiles: IHexTilesResult[], generateEntityType: GenerateEntityType): void {
        const hexTileInstancesData: IHexTileInstanceData[] = this.convertToHexTileInstanceData(tiles);

        this.hexTileInstances[generateEntityType] = [];

        for (let i = 0; i < hexTileInstancesData.length; i++) {
            const hexTileInstance = new HexTileInstance(hexTileInstancesData[i], DebugGameConfig.generateType[generateEntityType].hexTileDebug);
            this.add(hexTileInstance);

            this.hexTileInstances[generateEntityType].push(hexTileInstance);
        }
    }

    private initEntropyHelper(): void {
        if (DebugGameConfig.generateType[GenerateEntityType.Landscape].entropy) {
            const entropyHelper = this.entropyHelper = new EntropyHelper();
            this.add(entropyHelper);
        }
    }

    private showPredefinedLandscapeTiles(): void {
        if (this.generatingStopped) {
            return;
        }

        const predefinedTiles = DefaultWFCConfig.predefinedTiles;
        for (let i = 0; i < predefinedTiles.length; i++) {
            const hexTileInstance = this.findHexTileInstanceByPosition(predefinedTiles[i].coord, GenerateEntityType.Landscape);
            if (hexTileInstance) {
                hexTileInstance.showTile(predefinedTiles[i].coord);
            }
        }
    }

    private showTiles(stepIndex: number, count: number, generateEntityType: GenerateEntityType): void {
        for (let i = stepIndex; i < stepIndex + count; i++) {
            if (i >= this.steps[generateEntityType].length) {
                this.tilesShowState = TilesShowState.CompleteEntity;
                return;
            }

            const step: INewTileStep = this.steps[generateEntityType][i];
            if (step.tile) {
                const hexTileInstance = this.findHexTileInstanceByPosition(step.tile.position, generateEntityType);
                if (hexTileInstance) {
                    hexTileInstance.showTile(step.tile.position);
                }
            }

        }

        if (this.showingEntityType === GenerateEntityType.Landscape) {
            this.entropyHelper?.drawStep(stepIndex);
        }
    }

    private afterShowGenerateEntity(): void {
        switch (this.showingEntityType) {
            case GenerateEntityType.Landscape:
                this.entropyHelper?.reset();
                break;
        }

        this.showingEntityIndex++;
        if (this.showingEntityIndex >= GenerateEntityOrder.length) {
            this.tilesShowState = TilesShowState.Completed;
            return;
        }

        this.showingEntityType = GenerateEntityOrder[this.showingEntityIndex];
        this.stepIndex = 0;
        this.time = 0;
        this.configureDelay();

        this.checkShowEntityInstant();
        this.tilesShowState = TilesShowState.Ready;
    }

    private showAllTilesByType(generateEntityType: GenerateEntityType): void {
        for (let i = 0; i < this.hexTileInstances[generateEntityType].length; i++) {
            this.hexTileInstances[generateEntityType][i].showAllTiles();
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

    private findHexTileInstanceByPosition(position: IHexCoord, generateEntityType: GenerateEntityType): HexTileInstance {
        return this.hexTileInstances[generateEntityType].find(hexTileInstance => hexTileInstance.hasTileByPosition(position));
    }

    private resetScene(): void {
        this.tilesShowState = TilesShowState.NotReady;

        this.time = 0;
        this.stepIndex = 0;
        this.showingEntityIndex = 0;
        this.showingEntityType = GenerateEntityOrder[this.showingEntityIndex];

        for (const generateType in GenerateEntityType) {
            const type: GenerateEntityType = GenerateEntityType[generateType as keyof typeof GenerateEntityType];
            this.hexTileInstances[type].forEach((hexTileInstance) => {
                hexTileInstance.reset();
                this.remove(hexTileInstance);
            });
            this.hexTileInstances[type] = [];
            this.steps[type] = [];
        }


        this.entropyHelper?.reset();
    }

    private initGlobalListeners(): void {
        GlobalEventBus.on('game:generate', () => this.generateScene());
        GlobalEventBus.on('game:fieldRadiusChanged', (radius: number) => this.onFieldRadiusChanged(radius));
        GlobalEventBus.on('ui:sliderPointerUp', () => this.onSliderPointerUp());
        GlobalEventBus.on('ui:sliderPointerDown', () => this.sliderPointerDown());
        GlobalEventBus.on('game:stopGenerate', () => this.stopGenerate());
    }

    private async generateScene(): Promise<void> {
        this.generatingStopped = false;
        this.disableIntro();

        this.resetScene();
        this.checkAsyncGenerate();

        await this.generateLandscapeTiles();
        this.generateWall();

        this.configureDelay();

        this.showPredefinedLandscapeTiles();
        this.checkShowEntityInstant();
        this.tilesShowState = TilesShowState.Ready;
    }

    private checkAsyncGenerate(): void {
        this.needAsyncGenerate = DefaultWFCConfig.radius > GameConfig.WFC.syncGenerationRadius;
    }

    private disableIntro(): void {
        if (this.isIntroActive) {
            this.intro.hide();
            this.isIntroActive = false;
        }
    }

    private checkShowEntityInstant(): void {
        if (this.generatingStopped) {
            return;
        }

        if (DebugGameConfig.generateType[this.showingEntityType].showInstantly) {
            this.showAllTilesByType(this.showingEntityType);
            this.tilesShowState = TilesShowState.CompleteEntity;
            this.afterShowGenerateEntity();
        } 
    }

    private configureDelay(): void {
        if (this.generatingStopped) {
            return;
        }

        switch (this.showingEntityType) {
            case GenerateEntityType.Landscape:
                const delays = GameConfig.gameField.showTilesDelays;
                this.showTileStepTime = Math.max(delays.min, Math.min(delays.max, 1 / DefaultWFCConfig.radius * delays.coeff));
                break;

            case GenerateEntityType.Walls:
                this.showTileStepTime = 30;
                break;
        }

    }

    private onFieldRadiusChanged(radius: number): void {
        DefaultWFCConfig.radius = radius;

        if (this.isIntroActive) {
            this.intro.showByRadius(DefaultWFCConfig.radius);
        } else {
            this.fieldRadiusHelper.show(DefaultWFCConfig.radius);
        }
    }

    private onSliderPointerUp(): void {
        if (!this.isIntroActive) {
            this.fieldRadiusHelper.hide();
        }
    }

    private sliderPointerDown(): void {
        if (!this.isIntroActive) {
            this.fieldRadiusHelper.show(DefaultWFCConfig.radius);
        }
    }

    private stopGenerate(): void {
        this.hexWFC.stopGeneration();

        this.intro.show();
        this.intro.showByRadius(DefaultWFCConfig.radius);
        this.isIntroActive = true;

        this.resetScene();
        this.tilesShowState = TilesShowState.NotReady;

        this.generatingStopped = true;
    }
}
