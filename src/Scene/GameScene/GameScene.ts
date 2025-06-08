import * as THREE from 'three';
import { ILibrariesData } from '../../Data/Interfaces/IBaseSceneData';
import GroundCell from './GroundCell/GroundCell';
import { HexCoord } from '../../Data/Interfaces/ICell';
import DebugGrid from './DebugGrid';
import DebugConfig from '../../Data/Configs/Debug/DebugConfig';
import { GroundCellType } from '../../Data/Enums/GroundCellType';
import { baseTileDefinitions } from '../../Data/Configs/CellsRules';
import { HexWFC, ResolvedCell } from './WaveFunctionCollapse';


export default class GameScene extends THREE.Group {
    private data: ILibrariesData;

    private groundCells: GroundCell[] = [];

    constructor(data: ILibrariesData) {
        super();

        this.data = data;

        // this.init();
        this.init3();
        this.initDebugGrid();
    }

    public update(dt: number): void {

    }

    private init(): void {
        const mapRadius = 3;
        const cellsMap: HexCoord[] = [];
        for (let q = -mapRadius; q <= mapRadius; q++) {
            const r1 = Math.max(-mapRadius, -q - mapRadius);
            const r2 = Math.min(mapRadius, -q + mapRadius);
            for (let r = r1; r <= r2; r++) {
                cellsMap.push({ q, r });
            }
        }

        cellsMap.forEach((coord) => {
            // const type = Math.random() > 0.5 ? GroundCellType.Grass : GroundCellType.Sand;
            const cell = new GroundCell(GroundCellType.RoadD);
            cell.setCellPosition(coord);
            cell.setCellRotation(0);
            this.add(cell);

            this.groundCells.push(cell);
        });

        // const cell: GroundCell = this.getCellByHexCoord({ q: 0, r: 0 });
        // cell.setCellRotation(1);

        // const cell2: GroundCell = this.getCellByHexCoord({ q: 1, r: 0 });
        // cell2.setCellRotation(5);
    }

    private initDebugGrid(): void {
        if (DebugConfig.game.grid) {
            const debugGrid = new DebugGrid();
            this.add(debugGrid);
        }
    }

    private getCellByHexCoord(coord: HexCoord): GroundCell | null {
        for (const cell of this.groundCells) {
            const position: HexCoord = cell.getCellPosition();
            if (position.q === coord.q && position.r === coord.r) {
                return cell;
            }
        }

        return null;
    }


    private init3(): void {
        const wfc = new HexWFC(baseTileDefinitions);
        wfc.initializeGrid(3);
        const adjacency = wfc.generateAdjacencyMap();
        const resolved = wfc.run(adjacency);
        console.log(resolved);

        this.renderGrid(resolved);
    }

    private renderGrid(grid: ResolvedCell[]): void {
        grid.forEach(cell => {
            const groundCell = new GroundCell(cell.type);
            groundCell.setCellPosition(cell.coord);
            groundCell.setCellRotation(cell.rotation);
            this.add(groundCell);
            this.groundCells.push(groundCell);
        });
    }

}
