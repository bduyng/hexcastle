import * as THREE from 'three';
import ThreeJSHelper from '../../../Helpers/ThreeJSHelper';
import { IHexTileTransform, IHexTileInstanceData, IHexCoord } from '../../../Data/Interfaces/IHexTile';
import { HexTileType } from '../../../Data/Enums/HexTileType';
import HexTileModelConfig from '../../../Data/Configs/HexTileModelConfig';
import Materials from '../../../Core/Materials/Materials';
import { MaterialType } from '../../../Data/Enums/MaterialType';
import HexGridHelper from '../../../Helpers/HexGridHelper';
import GridConfig from '../../../Data/Configs/GridConfig';
import { GridOrientation } from '../../../Data/Enums/GridOrientation';

export default class HexTileInstance extends THREE.Group {
    private hexTileInstanceData: IHexTileInstanceData;
    private instance: THREE.InstancedMesh;
    private hexTileType: HexTileType;

    constructor(hexTileInstanceData: IHexTileInstanceData) {
        super();

        this.hexTileInstanceData = hexTileInstanceData;

        this.init();
    }

    public getPositions(): IHexCoord[] {
        return this.hexTileInstanceData.transforms.map(transform => transform.position);
    }

    private init(): void {
        this.hexTileType = this.hexTileInstanceData.type;
        const hexTileTransforms: IHexTileTransform[] = this.hexTileInstanceData.transforms;

        const material: THREE.Material = Materials.getInstance().materials[MaterialType.Main];

        const modelName: string = HexTileModelConfig[this.hexTileType].modelName;
        const geometry: THREE.BufferGeometry = ThreeJSHelper.getGeometryFromModel(modelName);

        const instanceCount: number = hexTileTransforms.length;
        const instanceMesh = this.instance = new THREE.InstancedMesh(geometry, material, instanceCount);
        this.add(instanceMesh);
        // instanceMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

        const defaultRotation: number = GridConfig.GridOrientation === GridOrientation.PointyTop ? Math.PI : Math.PI / 2 + Math.PI / 3;
        const matrix = new THREE.Matrix4();

        for (let i = 0; i < instanceCount; i++) {
            const hexTileTransform: IHexTileTransform = hexTileTransforms[i];
            const position = HexGridHelper.axialToWorld(hexTileTransform.position, GridConfig.hexSize, GridConfig.GridOrientation);
            const rotationYAngle = HexGridHelper.hexRotationToAngle(hexTileTransform.rotation) + defaultRotation;
            const rotationQuaternion = new THREE.Quaternion();
            rotationQuaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotationYAngle);
            const scale = new THREE.Vector3(1, 1, 1);

            matrix.compose(position, rotationQuaternion, scale);
        
            instanceMesh.setMatrixAt(i, matrix);
        }

        instanceMesh.instanceMatrix.needsUpdate = true;
    }
}
