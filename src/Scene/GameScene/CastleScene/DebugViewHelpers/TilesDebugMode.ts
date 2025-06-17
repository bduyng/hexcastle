import * as THREE from 'three';
import { HexTileType } from '../../../../Data/Enums/HexTileType';
import { EdgesDebugHexTiles } from '../../../../Data/Configs/DebugInfoConfig';
import { IHexTileDebugConfig } from '../../../../Data/Interfaces/IHexTile';
import HexTile from '../HexTile/HexTile';


export default class TilesDebugDebug extends THREE.Group {
    private hexTileTypes: HexTileType[];

    constructor() {
        super();

        this.hexTileTypes = EdgesDebugHexTiles;

        this.init();
    }

    private init(): void {
        const cellSize = 4;
        const gridSize = Math.ceil(Math.sqrt(this.hexTileTypes.length));

        const hexTileDebugConfig: IHexTileDebugConfig = {
            rotation: true,
            edge: true,
            modelName: true,
        }

        for (let i = 0; i < this.hexTileTypes.length; i++) {
            const hexTileType = this.hexTileTypes[i];
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
