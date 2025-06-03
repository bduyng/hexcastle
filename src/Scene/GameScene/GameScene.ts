import * as THREE from 'three';
import { ILibrariesData } from '../../Data/Interfaces/IBaseSceneData';
import GroundCell from './GroundCell';
import { HexCoord } from '../../Data/Interfaces/ICell';
import DebugGrid from './DebugGrid';

export default class GameScene extends THREE.Group {
    private data: ILibrariesData;

    private groundCells: GroundCell[] = [];

    constructor(data: ILibrariesData) {
        super();

        this.data = data;

        this.init();
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

        cellsMap.forEach((coord, index) => {
            const cell = new GroundCell();
            cell.setCellPosition(coord);
            cell.setCellRotation(1);
            this.add(cell);

            this.groundCells.push(cell);
        });

        // const cell: GroundCell = this.getCellByHexCoord({ q: -1, r: 0 });
        // cell.position.y = 0.5;

        this.initDebugGrid();
    }

    private initDebugGrid(): void {
        const debugGrid = new DebugGrid();
        this.add(debugGrid);

        debugGrid.position.set(0, 0.01, 0);
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

}
