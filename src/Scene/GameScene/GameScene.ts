import * as THREE from 'three';
import { ILibrariesData } from '../../Data/Interfaces/IBaseSceneData';
import GroundCell from './GroundCell/GroundCell';
import { HexCoord } from '../../Data/Interfaces/ICell';
import DebugGrid from './DebugGrid';
import DebugConfig from '../../Data/Configs/Debug/DebugConfig';
import { GroundCellType } from '../../Data/Enums/GroundCellType';
import HexGridHelper from '../../Helpers/HexGridHelper';
import { HexRotation } from '../../Data/Enums/HexRotation';

export default class GameScene extends THREE.Group {
    private data: ILibrariesData;

    private groundCells: GroundCell[] = [];

    constructor(data: ILibrariesData) {
        super();

        this.data = data;

        this.init();
        this.initDebugGrid();
    }

    public update(dt: number): void {

    }

    private init(): void {
        this.initTestCells();
    }

    private initTestCells(): void {
        const mapRadius = 0;
        const cellsMap: HexCoord[] = [];
        for (let q = -mapRadius; q <= mapRadius; q++) {
            const r1 = Math.max(-mapRadius, -q - mapRadius);
            const r2 = Math.min(mapRadius, -q + mapRadius);
            for (let r = r1; r <= r2; r++) {
                cellsMap.push({ q, r });
            }
        }

        cellsMap.forEach((coord) => {
            const cell = new GroundCell(GroundCellType.Grass);
            cell.setCellPosition(coord);
            cell.setCellRotation(0);
            this.add(cell);

            this.groundCells.push(cell);
        });

        // const cell: GroundCell = HexGridHelper.getCellByHexCoord(this.groundCells, { q: 0, r: 0 });
        // cell.setCellRotation(HexRotation.Rotate60);

        // const cell2: GroundCell = this.getCellByHexCoord({ q: 1, r: 0 });
        // cell2.setCellRotation(5);
    }

    private initDebugGrid(): void {
        if (DebugConfig.game.grid.enabled) {
            const debugGrid = new DebugGrid(DebugConfig.game.grid.radius);
            this.add(debugGrid);
        }
    }

}
