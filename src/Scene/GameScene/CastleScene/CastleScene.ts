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
import { IWallTile, WallGenerator } from './WallGenerator';
import { HexRotation } from '../../../Data/Enums/HexRotation';
import { HexTileType } from '../../../Data/Enums/HexTileType';
import HexTile from './HexTile/HexTile';

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
    private showTileStepTime: number = 0;
    private wallInstances: HexTileInstance[] = [];

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

                this.showTiles(this.stepIndex, stepsToShow);
                this.stepIndex += stepsToShow;
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
        // this.hexWFC.generate();

        // const grid: IHexTilesResult[] = this.hexWFC.getGrid();
        // this.steps = this.hexWFC.getSteps();

        // this.initGridTiles(grid);
        this.generateWall();
        // this.initEntropyView();
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
            this.generateWall();
            this.initEntropyView();
        }

        GlobalEventBus.emit('game:finishGeneratingWorld');
        this.previousGeneratePercent = 0;
    }

    private generateWall(): void {
        const wallShape = {
            center: { q: 0, r: 0 },
            radius: 3,
            maxOffset: 0,
        };

        const wallTiles = WallGenerator.generateRandomClosedWall(wallShape);
        // console.log(wallTiles);


        // const insideTiles = WallGenerator.findTilesInsideWall(wallTiles, wallShape.center);
        // console.log(insideTiles);

        // const outsideTiles = WallGenerator.findOutsideAdjacentTiles(wallTiles, insideTiles);
        // console.log(outsideTiles);

        this.renderWall(wallTiles);
    }

    private renderWall(wallTiles: IWallTile[]): void {
        const hexTileInstancesData: IHexTileInstanceData[] = [];

        for (let i = 0; i < wallTiles.length; i++) {
            const wallTile = wallTiles[i];
            const transform: IHexTileTransform = {
                position: wallTile.coord,
                rotation: wallTile.rotation,
            }

            hexTileInstancesData.push({
                type: wallTile.type,
                transforms: [transform],
            });
        }

        const walls: HexTile[] = [];
        
        for (let i = 0; i < hexTileInstancesData.length; i++) {
            // const hexTileInstance = new HexTileInstance(hexTileInstancesData[i], DebugConfig.game.hexTileDebug);
            // this.add(hexTileInstance);

            // this.wallInstances.push(hexTileInstance);
            const hexTile = new HexTile(hexTileInstancesData[i].type, DebugConfig.game.hexTileDebug);
            this.add(hexTile);

            hexTile.setHexTilePosition(hexTileInstancesData[i].transforms[0].position);
            hexTile.setHexTileRotation(hexTileInstancesData[i].transforms[0].rotation);
            hexTile.hide();

            walls.push(hexTile);
        }

        for (let i = 0; i < walls.length; i++) {
            const wall = walls[i];

            setTimeout(() => {
                wall.show();
            }, i * 30);
        }
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

        const delays = GameConfig.gameField.showTilesDelays;
        this.showTileStepTime = Math.max(delays.min, Math.min(delays.max, 1 / DefaultWFCConfig.radius * delays.coeff));
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

    private showTiles(stepIndex: number, count: number): void {
        for (let i = stepIndex; i < stepIndex + count; i++) {
            if (i >= this.steps.length) {
                this.tilesShowState = TilesShowState.Completed;
                this.entropyView?.reset();
                return;
            }

            const step: IWFCStep = this.steps[i];
            if (step.newTile) {
                const hexTileInstance = this.findHexTileInstanceByPosition(step.newTile.position);
                if (hexTileInstance) {
                    hexTileInstance.showTile(step.newTile.position);
                }
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

        this.wallInstances.forEach((wallInstance) => {
            wallInstance.reset();
            this.remove(wallInstance);
        });
        this.wallInstances = [];

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
