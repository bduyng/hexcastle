import * as THREE from 'three';
import { IHexCoord } from '../../../../Data/Interfaces/IHexTile';
import { GameConfig } from '../../../../Data/Configs/GameConfig';
import HexGridHelper from '../../../../Helpers/HexGridHelper';
import { GridOrientation } from '../../../../Data/Enums/GridOrientation';
import { MaterialType } from '../../../../Data/Enums/MaterialType';
import Materials from '../../../../Core/Materials/Materials';

export default class WallDebug extends THREE.Group {
    private insideTiles: THREE.InstancedMesh;

    constructor() {
        super();
    }

    public show(insideTiles: IHexCoord[]): void {
        this.reset();

        this.insideTiles = this.initTiles(insideTiles, MaterialType.TileDebugGreen);
        this.add(this.insideTiles);
    }

    public reset(): void {
        if (this.insideTiles) {
            this.remove(this.insideTiles);
            this.insideTiles.geometry.dispose();
        }
    }

    private initTiles(tiles: IHexCoord[], materialType: MaterialType): THREE.InstancedMesh {
        const geometry = new THREE.CircleGeometry(GameConfig.gameField.hexSize * 0.95, 6);
        const material: THREE.Material = Materials.getInstance().materials[materialType];

        const instanceCount: number = tiles.length;
        const tilesInstance = new THREE.InstancedMesh(geometry, material, instanceCount);

        const defaultRotation: number = GameConfig.gameField.GridOrientation === GridOrientation.PointyTop ? Math.PI / 2 : Math.PI / 3;
        const matrix = new THREE.Matrix4();

        for (let i = 0; i < instanceCount; i++) {
            const position = HexGridHelper.axialToWorld(tiles[i], GameConfig.gameField.hexSize, GameConfig.gameField.GridOrientation);
            position.y = 0.05;
            const rotationQuaternion = new THREE.Quaternion();
            const eulerRotation = new THREE.Euler(-Math.PI * 0.5, 0, defaultRotation, 'XYZ');
            rotationQuaternion.setFromEuler(eulerRotation);
            
            const scale = new THREE.Vector3(1, 1, 1);

            matrix.compose(position, rotationQuaternion, scale);

            tilesInstance.setMatrixAt(i, matrix);
        }

        tilesInstance.instanceMatrix.needsUpdate = true;

        return tilesInstance;
    }
}
