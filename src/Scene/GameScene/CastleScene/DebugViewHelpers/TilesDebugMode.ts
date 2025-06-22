import * as THREE from 'three';
import { HexTileType } from '../../../../Data/Enums/HexTileType';
import { IHexTileDebugConfig } from '../../../../Data/Interfaces/IHexTile';
import HexTile from '../HexTile/HexTile';
import { HexTileCategory } from '../../../../Data/Enums/HexTileCategory';
import { HexTilesByCategory } from '../../../../Data/Configs/HexTilesByCategory';


export default class TilesDebugMode extends THREE.Group {
    private hexTileCategory: HexTileCategory;

    constructor() {
        super();

        this.hexTileCategory = HexTileCategory.Walls;

        this.init();
    }

    private init(): void {
        const cellSize = 4;
        const gridSize = Math.ceil(Math.sqrt(this.hexTileCategory.length));

        const hexTileDebugConfig: IHexTileDebugConfig = {
            rotation: true,
            edge: true,
            modelName: true,
        }

        const tiles: HexTileType[] = HexTilesByCategory[this.hexTileCategory];

        for (let i = 0; i < tiles.length; i++) {
            const hexTileType = tiles[i];
            const hexTile = new HexTile(hexTileType, hexTileDebugConfig);
            this.add(hexTile);

            const row = Math.floor(i / gridSize);
            const col = i % gridSize;
            const x = col * cellSize - (gridSize - 1) * cellSize / 2;
            const z = row * cellSize - (gridSize - 1) * cellSize / 2;
            
            hexTile.position.set(x, 0, z);
        }
    }
}
