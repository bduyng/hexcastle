import * as THREE from 'three';
import GridConfig from '../../../../Data/Configs/GridConfig';
import { GridOrientation } from '../../../../Data/Enums/GridOrientation';
import { Text } from 'troika-three-text';
import { HexRotation } from '../../../../Data/Enums/HexRotation';
import HexGridHelper from '../../../../Helpers/HexGridHelper';
import { EdgeColor, RotationAngleName } from '../../../../Data/Configs/DebugInfoConfig';
import { GroundCellType } from '../../../../Data/Enums/GroundCellType';
import { EdgeType } from '../../../../Data/Enums/EdgeType';
import { CellRulesConfig } from '../../../../Data/Configs/CellsRules';
import DebugConfig from '../../../../Data/Configs/Debug/DebugConfig';

export default class GroundCellDebug extends THREE.Group {
    private cellType: GroundCellType;
    private rotationText: Text;
    private rotationTextWrapper: THREE.Group;
    private edgesWrapper: THREE.Group;

    constructor(cellType: GroundCellType) {
        super();

        this.cellType = cellType;

        this.init();
    }

    public setRotationText(rotation: HexRotation): void {
        if (this.rotationTextWrapper) {
            HexGridHelper.setRotation(this.rotationTextWrapper, rotation);
            this.rotationText.text = RotationAngleName[rotation];
        }

        if (this.edgesWrapper) {
            HexGridHelper.setRotation(this.edgesWrapper, rotation);
        }
    }

    private init(): void {
        if (DebugConfig.game.groundCellDebug.rotation) {
            this.initRotationDebug();
        }

        if (DebugConfig.game.groundCellDebug.edge) {
            this.initEdgesDebug();
        }
    }

    private initRotationDebug(): void {
        this.rotationTextWrapper = new THREE.Group();
        this.add(this.rotationTextWrapper);

        this.initRotationLine();
        this.initRotationText();
    }

    private initRotationLine(): void {
        const size: number = 0.2;
        const material: THREE.LineBasicMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });

        const points: THREE.Vector3[] = [];
        points.push(new THREE.Vector3(0, 0, 0));
        points.push(new THREE.Vector3(size, 0, 0));

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, material);
        this.rotationTextWrapper.add(line);

        line.position.set(0, 0.02, 0);

        const defaultRotation: number = GridConfig.GridOrientation === GridOrientation.PointyTop ? 0 : -Math.PI / 6;
        line.rotation.set(0, defaultRotation, 0);
    }

    private initRotationText(): void {
        const rotationText: Text = this.rotationText = this.createText(RotationAngleName[0], 0.20, 0xaa0000);
        this.rotationTextWrapper.add(rotationText);

        rotationText.rotation.x = -Math.PI / 2;
        rotationText.position.set(0, 0.03, 0);

        const defaultRotation: number = GridConfig.GridOrientation === GridOrientation.PointyTop ? 0 : -Math.PI / 6;
        const quaternion = new THREE.Quaternion();
        quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), defaultRotation - Math.PI * 0.5);
        rotationText.quaternion.multiplyQuaternions(quaternion, rotationText.quaternion);

        const direction = new THREE.Vector3(Math.cos(-defaultRotation), 0, Math.sin(-defaultRotation));
        rotationText.position.addScaledVector(direction, 0.4);
    }

    private initEdgesDebug(): void {
        this.edgesWrapper = new THREE.Group();
        this.add(this.edgesWrapper);

        for (let i = 0; i < 6; i++) {
            const edgeType: EdgeType = this.getEdgeTypes(this.cellType)[i];
            const edgeColor: number = EdgeColor[edgeType];

            const edgeText: Text = this.createText(edgeType as string, 0.15, edgeColor);
            this.edgesWrapper.add(edgeText);

            edgeText.rotation.x = -Math.PI / 2;
            edgeText.position.set(0, 0.03, 0);

            const defaultRotation: number = GridConfig.GridOrientation === GridOrientation.PointyTop ? 0 : -Math.PI / 6;
            const edgeRotation = defaultRotation - Math.PI / 3 * i;
            const quaternion = new THREE.Quaternion();
            quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), edgeRotation - Math.PI * 0.5);
            edgeText.quaternion.multiplyQuaternions(quaternion, edgeText.quaternion);

            const direction = new THREE.Vector3(Math.cos(-edgeRotation), 0, Math.sin(-edgeRotation));
            edgeText.position.addScaledVector(direction, 0.8);

        }
    }

    private getEdgeTypes(cellType: GroundCellType): EdgeType[] {
        const cellRules = CellRulesConfig.find(rule => rule.type === cellType);
        return cellRules ? cellRules.edges : [];

    }

    private createText(textString: string, fontSize?: number, color?: number): Text {
        const text = new Text();
        text.text = textString;
        text.fontSize = fontSize || 0.23;
        text.anchorX = 'center';
        text.anchorY = 'middle';
        text.color = color;

        return text;
    }
}
