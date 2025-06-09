import * as THREE from 'three';
import { ILibrariesData } from '../../Data/Interfaces/IBaseSceneData';
import HexTile from './HexTile/HexTile';
import { IHexCoord } from '../../Data/Interfaces/IHexTile';
import DebugGrid from './DebugGrid';
import DebugConfig from '../../Data/Configs/Debug/DebugConfig';
import { HexTileType } from '../../Data/Enums/HexTileType';
import HexGridHelper from '../../Helpers/HexGridHelper';
import { HexRotation } from '../../Data/Enums/HexRotation';
import { HexWFC } from './HexWFC';
import { HexTilesRulesConfig } from '../../Data/Configs/WFCConfig';
import { IHexTilesResult } from '../../Data/Interfaces/IWFC';

export default class GameScene extends THREE.Group {
    private data: ILibrariesData;

    private hexTiles: HexTile[] = [];

    constructor(data: ILibrariesData) {
        super();

        this.data = data;

        this.init();
        this.initDebugGrid();
    }

    public update(dt: number): void {

    }

    private init(): void {
        // this.initTestHexTiles();
        this.initHexWFC();
    }

    private initHexWFC(): void {
        const wfc = new HexWFC(3, HexTilesRulesConfig);
        const success = wfc.generate();

        if (success) {
            const grid = wfc.getGrid();
            this.renderGrid(grid);
        } else {
            console.error('Failed to generate grid');
        }
    }

    private renderGrid(grid: IHexTilesResult[]): void {
        grid.forEach((hexTileResult) => {
            const hexTile = new HexTile(hexTileResult.type);
            hexTile.setHexTilePosition(hexTileResult.position);
            hexTile.setHexTileRotation(hexTileResult.rotation);

            this.add(hexTile);
            this.hexTiles.push(hexTile);
        });
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
            const hexTile = new HexTile(HexTileType.RoadC);
            hexTile.setHexTilePosition(coord);
            hexTile.setHexTileRotation(0);
            this.add(hexTile);

            this.hexTiles.push(hexTile);
        });

        const hexTile: HexTile = HexGridHelper.getHexTileByHexCoord(this.hexTiles, { q: 0, r: 0 });
        hexTile.setHexTileRotation(HexRotation.Rotate0);
    }

    private initDebugGrid(): void {
        if (DebugConfig.game.grid.enabled) {
            const debugGrid = new DebugGrid(DebugConfig.game.grid.radius);
            this.add(debugGrid);
        }
    }

}
