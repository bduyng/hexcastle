import * as THREE from 'three';
// import Materials from '../../../Core/Materials/Materials';
// import { MaterialType } from '../../../Data/Enums/MaterialType';
import ThreeJSHelper from '../../../Helpers/ThreeJSHelper';
import { HexCoord } from '../../../Data/Interfaces/ICell';
import GridConfig from '../../../Data/Configs/GridConfig';
import HexGridHelper from '../../../Helpers/HexGridHelper';
import { GridOrientation } from '../../../Data/Enums/GridOrientation';
import GroundCellDebugInfo from './GroundCellDebugInfo';
import DebugConfig from '../../../Data/Configs/Debug/DebugConfig';
import { GroundCellType } from '../../../Data/Enums/GroundCellType';
import GroundCellConfig from '../../../Data/Configs/GroundCellConfig';
import Materials from '../../../Core/Materials/Materials';
import { MaterialType } from '../../../Data/Enums/MaterialType';

export default class GroundCell extends THREE.Group {
    private cellType: GroundCellType;
    private cellPosition: HexCoord;
    private cellRotation: number;
    private debugInfo: GroundCellDebugInfo;

    constructor(cellType: GroundCellType) {
        super();

        this.cellType = cellType;

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

    public getCellRotation(): number {
        return this.cellRotation;
    }

    public setCellRotation(rotation: number): void {
        this.cellRotation = rotation;
        HexGridHelper.setRotation(this, rotation);

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

        // const material: THREE.Material = new THREE.MeshPhongMaterial({
        //     color: GroundCellConfig[this.cellType].color,
        // });
        const modelName: string = GroundCellConfig[this.cellType].modelName;
        const geometry: THREE.BufferGeometry = ThreeJSHelper.getGeometryFromModel(modelName);

        const view: THREE.Mesh = new THREE.Mesh(geometry, material);
        this.add(view);

        const defaultRotation: number = GridConfig.GridOrientation === GridOrientation.PointyTop ? 0 : -Math.PI / 6;
        view.rotation.set(0, defaultRotation, 0);
    }

    private initDebugInfo(): void {
        if (DebugConfig.game.groundCellInfo) {
            const debugInfo = this.debugInfo = new GroundCellDebugInfo();
            this.add(debugInfo);
        }
    }
}
