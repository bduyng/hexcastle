import * as THREE from 'three';
import { ILibrariesData } from '../../Data/Interfaces/IBaseSceneData';
import HexTile from './HexTile/HexTile';
import { IHexTileTransform, IHexCoord, IHexTileInstanceData } from '../../Data/Interfaces/IHexTile';
import DebugConfig from '../../Data/Configs/Debug/DebugConfig';
import { HexTileType } from '../../Data/Enums/HexTileType';
import HexGridHelper from '../../Helpers/HexGridHelper';
import { HexRotation } from '../../Data/Enums/HexRotation';
import { HexWFC } from './HexWFC';
import { IHexTilesResult } from '../../Data/Interfaces/IWFC';
import HexTileInstance from './HexTile/HexTileInstance';
import { WFCTiles } from '../../Data/Configs/WFCConfig';
import DebugGrid from './Debug/DebugGrid';
import EdgesDebug from './Debug/EdgesDebug';
import { EdgesDebugHexTiles } from '../../Data/Configs/DebugInfoConfig';

export default class GameScene extends THREE.Group {
    private data: ILibrariesData;

    private hexTiles: HexTile[] = [];
    private hexTileInstances: HexTileInstance[] = [];

    constructor(data: ILibrariesData) {
        super();

        this.data = data;

        this.init();
    }

    public update(dt: number): void {

    }

    private init(): void {
        if (DebugConfig.game.edgesDebugMode) {
            const edgesDebug = new EdgesDebug();
            this.add(edgesDebug);

            return;
        }

        // this.initTestHexTiles();
        this.initHexWFC();


        this.initDebugGrid();
    }

    private initHexWFC(): void {
        const wfc = new HexWFC(3, WFCTiles);
        const success = wfc.generate();

        if (success) {
            const grid = wfc.getGrid();
            this.renderGrid(grid);
        } else {
            console.error('Failed to generate grid');
        }
    }

    private renderGrid(grid: IHexTilesResult[]): void {
        const hexTileInstancesData: IHexTileInstanceData[] = this.convertToHexTileInstanceData(grid);

        for (let i = 0; i < hexTileInstancesData.length; i++) {
            const hexTileInstance = new HexTileInstance(hexTileInstancesData[i]);
            this.add(hexTileInstance);

            this.hexTileInstances.push(hexTileInstance);
        }

        console.log(hexTileInstancesData);
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

    private initTestHexTiles(): void {
        const mapRadius = 0;
        const hexTilesMap: IHexCoord[] = [];
        for (let q = -mapRadius; q <= mapRadius; q++) {
            const r1 = Math.max(-mapRadius, -q - mapRadius);
            const r2 = Math.min(mapRadius, -q + mapRadius);
            for (let r = r1; r <= r2; r++) {
                hexTilesMap.push({ q, r });
            }
        }

        hexTilesMap.forEach((coord) => {
            const hexTile = new HexTile(HexTileType.RoadJ);
            hexTile.setHexTilePosition(coord);
            hexTile.setHexTileRotation(0);
            this.add(hexTile);

            this.hexTiles.push(hexTile);
        });

        const hexTile: HexTile = HexGridHelper.getHexTileByHexCoord(this.hexTiles, { q: 0, r: 0 });
        hexTile.setHexTileRotation(HexRotation.Rotate60);
    }

    private initDebugGrid(): void {
        if (DebugConfig.game.grid.enabled) {
            const debugGrid = new DebugGrid(DebugConfig.game.grid.radius);
            this.add(debugGrid);
        }
    }

}
