import * as THREE from 'three';
import { HexTileType } from '../../../Data/Enums/HexTileType';
import HexTileModelConfig from '../../../Data/Configs/HexTileModelConfig';
import ThreeJSHelper from '../../../Helpers/ThreeJSHelper';
import HexGridHelper from '../../../Helpers/HexGridHelper';
import Materials from '../../../Core/Materials/Materials';
import { MaterialType } from '../../../Data/Enums/MaterialType';
import { GameConfig } from '../../../Data/Configs/GameConfig';
import { IHexCoord } from '../../../Data/Interfaces/IHexTile';

export default class Intro extends THREE.Group {
    private tilesInstanceMesh: THREE.InstancedMesh;
    private hexCoordsById: IHexCoord[] = [];

    constructor() {
        super();

        this.init();
    }

    public hide(): void {
        this.visible = false;
    }

    private init(): void {
        this.initField();
        this.initCastle();
    }

    public showByRadius(radius: number): void {
        this.hideAllTiles();

        for (let q = -radius; q <= radius; q++) {
            const r1 = Math.max(-radius, -q - radius);
            const r2 = Math.min(radius, -q + radius);
            for (let r = r1; r <= r2; r++) {
                const index: number = this.hexCoordsById.findIndex(coord => coord.q === q && coord.r === r);
                ThreeJSHelper.updateInstanceTransform(this.tilesInstanceMesh, index, undefined, undefined, new THREE.Vector3(1, 1, 1));
            }
        }
    }

    private hideAllTiles(): void {
        for (let i = 0; i < this.hexCoordsById.length; i++) {
            ThreeJSHelper.updateInstanceTransform(this.tilesInstanceMesh, i, undefined, undefined, new THREE.Vector3(0.001, 0.001, 0.001));
        }
    }

    private initField(): void {
        const hexTileType: HexTileType = HexTileType.Grass;
        const modelName: string = HexTileModelConfig[hexTileType].modelName;
        const geometry: THREE.BufferGeometry = ThreeJSHelper.getGeometryFromModel(modelName);

        const material: THREE.Material = Materials.getInstance().materials[MaterialType.Transparent];
        const radius: number = GameConfig.gameField.radius.max - 1;

        const count: number = HexGridHelper.getCountByRadius(radius);
        const tilesInstanceMesh = this.tilesInstanceMesh = new THREE.InstancedMesh(geometry, material, count);
        this.add(tilesInstanceMesh);

        const matrix = new THREE.Matrix4();

        let instanceId: number = 0;

        for (let q = -radius; q <= radius; q++) {
            const r1 = Math.max(-radius, -q - radius);
            const r2 = Math.min(radius, -q + radius);
            for (let r = r1; r <= r2; r++) {
                const position = HexGridHelper.axialToWorld({ q, r }, GameConfig.gameField.hexSize, GameConfig.gameField.GridOrientation);
                const scale = new THREE.Vector3(0.001, 0.001, 0.001);
                const rotationQuaternion = new THREE.Quaternion();
                
                matrix.compose(position, rotationQuaternion, scale);

                tilesInstanceMesh.setMatrixAt(instanceId, matrix);
                instanceId++;

                this.hexCoordsById.push({ q, r });
            }
        }

        tilesInstanceMesh.instanceMatrix.needsUpdate = true;
    }

    private initCastle(): void {
        const geometry: THREE.BufferGeometry = ThreeJSHelper.getGeometryFromModel('building_castle_blue');
        const material: THREE.Material = Materials.getInstance().materials[MaterialType.Transparent];
        const castleMesh = new THREE.Mesh(geometry, material);
        this.add(castleMesh);
    }
}
