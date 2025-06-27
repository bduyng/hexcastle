import * as THREE from 'three';
import { IHexCoord } from '../../../Data/Interfaces/IHexTile';
import { GameConfig } from '../../../Data/Configs/GameConfig';
import HexGridHelper from '../../../Helpers/HexGridHelper';
import { GridOrientation } from '../../../Data/Enums/GridOrientation';
import { MaterialType } from '../../../Data/Enums/MaterialType';
import Materials from '../../../Core/Materials/Materials';
import { IIsland } from '../../../Data/Interfaces/IIsland';

export default class IslandsDebug extends THREE.Group {
    private tiles: THREE.InstancedMesh;

    constructor() {
        super();
    }

    public show(islands: IIsland[]): void {
        this.reset();

        const tiles: IHexCoord[][] = [];
        const centers: IHexCoord[] = [];
        for (let i = 0; i < islands.length; i++) {
            const island = islands[i];
            if (island.tiles.length > 0) {
                tiles.push(island.tiles);
                centers.push(island.center);
            }
        }

        this.tiles = this.initTiles(tiles, centers);
        this.add(this.tiles);
    }

    public reset(): void {
        if (this.tiles) {
            this.remove(this.tiles);
            this.tiles.geometry.dispose();
        }
    }

    private initTiles(tiles: IHexCoord[][], centers: IHexCoord[]): THREE.InstancedMesh {
        const geometry = new THREE.CircleGeometry(GameConfig.gameField.hexSize * 0.95, 6);
        const material: THREE.Material = Materials.getInstance().materials[MaterialType.TileDebugWhite];

        const instanceCount: number = tiles.reduce((count, island) => count + island.length, 0);
        const tilesInstance = new THREE.InstancedMesh(geometry, material, instanceCount);

        const defaultRotation: number = GameConfig.gameField.GridOrientation === GridOrientation.PointyTop ? Math.PI / 2 : Math.PI / 3;
        const matrix = new THREE.Matrix4();

        let index = 0;
        let color: number;

        for (let i = 0; i < tiles.length; i++) {
            for (let j = 0; j < tiles[i].length; j++) {
                color = HexGridHelper.isPositionsEqual(tiles[i][j], centers[i]) ? 0xff0000 : 0x00ff00;
                const position = HexGridHelper.axialToWorld(tiles[i][j], GameConfig.gameField.hexSize, GameConfig.gameField.GridOrientation);
                position.y = 0.05;
                const rotationQuaternion = new THREE.Quaternion();
                const eulerRotation = new THREE.Euler(-Math.PI * 0.5, 0, defaultRotation, 'XYZ');
                rotationQuaternion.setFromEuler(eulerRotation);

                const scale = new THREE.Vector3(1, 1, 1);

                matrix.compose(position, rotationQuaternion, scale);

                tilesInstance.setMatrixAt(index, matrix);
                tilesInstance.setColorAt(index, new THREE.Color(color));

                index++;
            };
        }

        tilesInstance.instanceMatrix.needsUpdate = true;
        tilesInstance.instanceColor.needsUpdate = true;

        return tilesInstance;
    }
}
