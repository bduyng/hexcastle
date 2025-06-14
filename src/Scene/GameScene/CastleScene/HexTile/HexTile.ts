import * as THREE from 'three';
import ThreeJSHelper from '../../../../Helpers/ThreeJSHelper';
import { IHexCoord, IHexTileDebugConfig } from '../../../../Data/Interfaces/IHexTile';
import GridConfig from '../../../../Data/Configs/GridConfig';
import HexGridHelper from '../../../../Helpers/HexGridHelper';
import { GridOrientation } from '../../../../Data/Enums/GridOrientation';
import HexTileDebug from './HexTileDebug';
import { HexTileType } from '../../../../Data/Enums/HexTileType';
import HexTileModelConfig from '../../../../Data/Configs/HexTileModelConfig';
import Materials from '../../../../Core/Materials/Materials';
import { MaterialType } from '../../../../Data/Enums/MaterialType';
import { HexRotation } from '../../../../Data/Enums/HexRotation';

export default class HexTile extends THREE.Group {
    private hexTileType: HexTileType;
    private hexTilePosition: IHexCoord;
    private hexTileRotation: HexRotation;
    private debugInfo: HexTileDebug;
    private wrapper: THREE.Group;
    private hexTileDebugConfig: IHexTileDebugConfig;

    constructor(hexTileType: HexTileType, hexTileDebugConfig: IHexTileDebugConfig = null) {
        super();

        this.hexTileType = hexTileType;
        this.hexTileDebugConfig = hexTileDebugConfig;

        this.wrapper = new THREE.Group();
        this.add(this.wrapper);

        this.init();
    }

    public getHexTilePosition(): IHexCoord {
        return this.hexTilePosition;
    }

    public setHexTilePosition(position: IHexCoord): void {
        this.hexTilePosition = position;
        const newPosition = HexGridHelper.axialToWorld(position, GridConfig.hexSize, GridConfig.GridOrientation);
        this.position.set(newPosition.x, 0, newPosition.z);
    }

    public getHexTileRotation(): HexRotation {
        return this.hexTileRotation;
    }

    public setHexTileRotation(rotation: HexRotation): void {
        this.hexTileRotation = rotation;
        HexGridHelper.setRotation(this.wrapper, rotation);

        if (this.debugInfo) {
            this.debugInfo.setRotation(rotation);
        }
    }

    private init(): void {
        this.initView();
        this.initDebugInfo();
    }

    private initView(): void {
        const material: THREE.Material = Materials.getInstance().materials[MaterialType.Main];

        const modelName: string = HexTileModelConfig[this.hexTileType].modelName;
        const geometry: THREE.BufferGeometry = ThreeJSHelper.getGeometryFromModel(modelName);

        const view: THREE.Mesh = new THREE.Mesh(geometry, material);
        this.wrapper.add(view);

        const defaultRotation: number = GridConfig.GridOrientation === GridOrientation.PointyTop ? Math.PI : Math.PI / 2 + Math.PI / 3;
        view.rotation.set(0, defaultRotation, 0);
    }

    private initDebugInfo(): void {
        if (this.hexTileDebugConfig) {
            const debugInfo = this.debugInfo = new HexTileDebug(this.hexTileType, this.hexTileDebugConfig);
            this.add(debugInfo);
        }
    }
}
