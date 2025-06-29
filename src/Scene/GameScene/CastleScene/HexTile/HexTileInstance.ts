import * as THREE from 'three';
import ThreeJSHelper from '../../../../Helpers/ThreeJSHelper';
import { IHexTileTransform, IHexTileInstanceData, IHexCoord, IHexTileDebugConfig, IHexTileInstanceIndex } from '../../../../Data/Interfaces/IHexTile';
import { HexTileType } from '../../../../Data/Enums/HexTileType';
import HexTileModelConfig from '../../../../Data/Configs/HexTileModelConfig';
import Materials from '../../../../Core/Materials/Materials';
import { MaterialType } from '../../../../Data/Enums/MaterialType';
import HexGridHelper from '../../../../Helpers/HexGridHelper';
import { GridOrientation } from '../../../../Data/Enums/GridOrientation';
import HexTileDebug from './HexTileDebug';
import { GameConfig } from '../../../../Data/Configs/GameConfig';
import { TilesShadowConfig } from '../../../../Data/Configs/TilesShadowConfig';
import TWEEN from 'three/addons/libs/tween.module.js';

export default class HexTileInstance extends THREE.Group {
    private hexTileInstanceData: IHexTileInstanceData;
    private hexTileType: HexTileType;
    private hexTileDebugConfig: IHexTileDebugConfig;
    private hexTileInstanceMesh: THREE.InstancedMesh;
    private hexTileInstanceIndexes: IHexTileInstanceIndex[] = [];
    private hexTilesDebug: { tile: HexTileDebug, position: IHexCoord }[] = [];
    private materialType: MaterialType;

    constructor(hexTileInstanceData: IHexTileInstanceData, hexTileDebugConfig: IHexTileDebugConfig = null, materialType: MaterialType = MaterialType.Main) {
        super();

        this.hexTileInstanceData = hexTileInstanceData;
        this.hexTileDebugConfig = hexTileDebugConfig;
        this.hexTileType = this.hexTileInstanceData.type;
        this.materialType = materialType;

        this.init();
    }

    public getPositions(): IHexCoord[] {
        return this.hexTileInstanceData.transforms.map(transform => transform.position);
    }

    public hasTileByPosition(position: IHexCoord): boolean {
        return this.hexTileInstanceData.transforms.some(transform => transform.position.q === position.q && transform.position.r === position.r);
    }

    public showTile(position: IHexCoord): void {
        const index: number = this.hexTileInstanceIndexes.find(index => index.transform.position.q === position.q && index.transform.position.r === position.r)?.index;

        if (index !== undefined) {
            const scale = { value: 0.001 };

            new TWEEN.Tween(scale)
                .to({ value: 1 }, 100)
                .easing(TWEEN.Easing.Quadratic.Out)
                .start()
                .onUpdate(() => {
                    ThreeJSHelper.updateInstanceTransform(this.hexTileInstanceMesh, index, undefined, undefined, new THREE.Vector3(scale.value, scale.value, scale.value));
                })
                .onComplete(() => {
                    ThreeJSHelper.updateInstanceTransform(this.hexTileInstanceMesh, index, undefined, undefined, new THREE.Vector3(1, 1, 1));
                });
        }

        const tileDebug = this.hexTilesDebug.find(tile => tile.position.q === position.q && tile.position.r === position.r);
        if (tileDebug) {
            tileDebug.tile.show();
        }
    }

    public showAllTiles(): void {
        for (let i = 0; i < this.hexTileInstanceIndexes.length; i++) {
            const index = this.hexTileInstanceIndexes[i];
            ThreeJSHelper.updateInstanceTransform(this.hexTileInstanceMesh, index.index, undefined, undefined, new THREE.Vector3(1, 1, 1));
        }
    }

    public reset(): void {
        this.hexTileInstanceMesh.geometry.dispose();
        this.remove(this.hexTileInstanceMesh);
        this.hexTileInstanceIndexes = [];

        this.hexTilesDebug.forEach(tileDebug => {
            tileDebug.tile.reset();
            this.remove(tileDebug.tile);
        });
        this.hexTilesDebug = [];
    }

    private init(): void {
        this.initView();
        this.initHexTileDebug();
    }

    private initView(): void {
        const hideScale: number = 0.001;
        const hexTileTransforms: IHexTileTransform[] = this.hexTileInstanceData.transforms;

        const material: THREE.Material = Materials.getInstance().materials[this.materialType];

        const modelName: string = HexTileModelConfig[this.hexTileType].modelName;
        const geometry: THREE.BufferGeometry = ThreeJSHelper.getGeometryFromModel(modelName);

        const instanceCount: number = hexTileTransforms.length;
        const instanceMesh = this.hexTileInstanceMesh = new THREE.InstancedMesh(geometry, material, instanceCount);
        this.add(instanceMesh);
        // instanceMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

        const defaultRotation: number = GameConfig.gameField.GridOrientation === GridOrientation.PointyTop ? Math.PI : Math.PI / 2 + Math.PI / 3;
        const matrix = new THREE.Matrix4();

        for (let i = 0; i < instanceCount; i++) {
            const hexTileTransform: IHexTileTransform = hexTileTransforms[i];
            const position = HexGridHelper.axialToWorld(hexTileTransform.position, GameConfig.gameField.hexSize, GameConfig.gameField.GridOrientation);
            const rotationYAngle = HexGridHelper.hexRotationToAngle(hexTileTransform.rotation) + defaultRotation;
            const rotationQuaternion = new THREE.Quaternion();
            rotationQuaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotationYAngle);
            const scale = new THREE.Vector3(hideScale, hideScale, hideScale);

            matrix.compose(position, rotationQuaternion, scale);

            instanceMesh.setMatrixAt(i, matrix);

            this.hexTileInstanceIndexes.push({
                index: i,
                transform: hexTileTransform
            });
        }

        instanceMesh.instanceMatrix.needsUpdate = true;

        instanceMesh.castShadow = TilesShadowConfig[this.hexTileType].castShadow;
        instanceMesh.receiveShadow = TilesShadowConfig[this.hexTileType].receiveShadow;
    }

    private initHexTileDebug(): void {
        if (this.hexTileDebugConfig?.edge || this.hexTileDebugConfig?.rotation) {
            for (let i = 0; i < this.hexTileInstanceData.transforms.length; i++) {
                const transform: IHexTileTransform = this.hexTileInstanceData.transforms[i];
                const position = HexGridHelper.axialToWorld(transform.position, GameConfig.gameField.hexSize, GameConfig.gameField.GridOrientation);

                const hexTileDebug = new HexTileDebug(this.hexTileType, this.hexTileDebugConfig);
                this.add(hexTileDebug);

                hexTileDebug.position.copy(position);
                hexTileDebug.setRotation(transform.rotation);

                this.hexTilesDebug.push({
                    tile: hexTileDebug,
                    position: transform.position
                });

                hexTileDebug.hide();
            }
        }
    }
}
