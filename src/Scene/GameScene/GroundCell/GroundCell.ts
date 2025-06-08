import * as THREE from 'three';
import ThreeJSHelper from '../../../Helpers/ThreeJSHelper';
import { HexCoord } from '../../../Data/Interfaces/ICell';
import GridConfig from '../../../Data/Configs/GridConfig';
import HexGridHelper from '../../../Helpers/HexGridHelper';
import { GridOrientation } from '../../../Data/Enums/GridOrientation';
import GroundCellDebug from './Debug/GroundCellDebug';
import DebugConfig from '../../../Data/Configs/Debug/DebugConfig';
import { GroundCellType } from '../../../Data/Enums/GroundCellType';
import GroundCellConfig from '../../../Data/Configs/GroundCellConfig';
import Materials from '../../../Core/Materials/Materials';
import { MaterialType } from '../../../Data/Enums/MaterialType';
import { HexRotation } from '../../../Data/Enums/HexRotation';

export default class GroundCell extends THREE.Group {
    private cellType: GroundCellType;
    private cellPosition: HexCoord;
    private cellRotation: HexRotation;
    private debugInfo: GroundCellDebug;
    private wrapper: THREE.Group;

    constructor(cellType: GroundCellType) {
        super();

        this.cellType = cellType;

        this.wrapper = new THREE.Group();
        this.add(this.wrapper);

        this.init();
    }

    public getCellPosition(): HexCoord {
        return this.cellPosition;
    }

    public setCellPosition(position: HexCoord): void {
        this.cellPosition = position;
        const newPosition = HexGridHelper.axialToWorld(position, GridConfig.hexSize, GridConfig.GridOrientation);
        this.position.set(newPosition.x, 0, newPosition.z);
    }

    public getCellRotation(): HexRotation {
        return this.cellRotation;
    }

    public setCellRotation(rotation: HexRotation): void {
        this.cellRotation = rotation;
        HexGridHelper.setRotation(this.wrapper, rotation);

        if (this.debugInfo) {
            this.debugInfo.setRotationText(rotation);
        }
    }

    private init(): void {
        this.initView();
        this.initDebugInfo();
    }

    private initView(): void {
        const material: THREE.Material = Materials.getInstance().materials[MaterialType.Main];

        const modelName: string = GroundCellConfig[this.cellType].modelName;
        const geometry: THREE.BufferGeometry = ThreeJSHelper.getGeometryFromModel(modelName);

        const view: THREE.Mesh = new THREE.Mesh(geometry, material);
        this.wrapper.add(view);

        const defaultRotation: number = GridConfig.GridOrientation === GridOrientation.PointyTop ? Math.PI : Math.PI / 2 + Math.PI / 3;
        view.rotation.set(0, defaultRotation, 0);
    }

    private initDebugInfo(): void {
        if (DebugConfig.game.groundCellDebug.edge || DebugConfig.game.groundCellDebug.rotation) {
            const debugInfo = this.debugInfo = new GroundCellDebug(this.cellType);
            this.add(debugInfo);
        }
    }
}
