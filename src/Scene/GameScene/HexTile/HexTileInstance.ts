import * as THREE from 'three';
import ThreeJSHelper from '../../../Helpers/ThreeJSHelper';
import { IHexTileTransform, IHexTileInstanceData, IHexCoord, IHexTileDebugConfig } from '../../../Data/Interfaces/IHexTile';
import { HexTileType } from '../../../Data/Enums/HexTileType';
import HexTileModelConfig from '../../../Data/Configs/HexTileModelConfig';
import Materials from '../../../Core/Materials/Materials';
import { MaterialType } from '../../../Data/Enums/MaterialType';
import HexGridHelper from '../../../Helpers/HexGridHelper';
import GridConfig from '../../../Data/Configs/GridConfig';
import { GridOrientation } from '../../../Data/Enums/GridOrientation';
import HexTileDebug from './Debug/HexTileDebug';

export default class HexTileInstance extends THREE.Group {
    private hexTileInstanceData: IHexTileInstanceData;
    private hexTileType: HexTileType;
    private hexTileDebugConfig: IHexTileDebugConfig;

    constructor(hexTileInstanceData: IHexTileInstanceData, hexTileDebugConfig: IHexTileDebugConfig = null) {
        super();

        this.hexTileInstanceData = hexTileInstanceData;
        this.hexTileDebugConfig = hexTileDebugConfig;
        this.hexTileType = this.hexTileInstanceData.type;

        this.init();
    }

    public getPositions(): IHexCoord[] {
        return this.hexTileInstanceData.transforms.map(transform => transform.position);
    }

    private init(): void {
        this.initView();
        this.initHexTileDebug();
    }

    private initView(): void {
        const hexTileTransforms: IHexTileTransform[] = this.hexTileInstanceData.transforms;

        const material: THREE.Material = Materials.getInstance().materials[MaterialType.Main];

        const modelName: string = HexTileModelConfig[this.hexTileType].modelName;
        const geometry: THREE.BufferGeometry = ThreeJSHelper.getGeometryFromModel(modelName);

        const instanceCount: number = hexTileTransforms.length;
        const instanceMesh = new THREE.InstancedMesh(geometry, material, instanceCount);
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

    private initHexTileDebug(): void {
        if (this.hexTileDebugConfig.edge || this.hexTileDebugConfig.rotation) {
            for (let i = 0; i < this.hexTileInstanceData.transforms.length; i++) {
                const transform: IHexTileTransform = this.hexTileInstanceData.transforms[i];
                const position = HexGridHelper.axialToWorld(transform.position, GridConfig.hexSize, GridConfig.GridOrientation);

                const hexTileDebug = new HexTileDebug(this.hexTileType, this.hexTileDebugConfig);
                this.add(hexTileDebug);

                hexTileDebug.position.copy(position);
                hexTileDebug.setRotation(transform.rotation);
            }
        }
    }
}
