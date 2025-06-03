import * as THREE from 'three';
import GridConfig from '../../../Data/Configs/GridConfig';
import { GridOrientation } from '../../../Data/Enums/GridOrientation';
import { Text } from 'troika-three-text';

export default class GroundCellDebugInfo extends THREE.Group {
    private rotationText: Text;

    constructor() {
        super();

        this.init();
    }

    public setRotationText(rotation: number): void {
        if (this.rotationText) {
            this.rotationText.text = rotation.toString();
        }
    }

    private init(): void {
        this.initRotationLine();
        this.initRotationText();
    }

    private initRotationLine(): void {
        const size: number = 0.4;
        const material: THREE.LineBasicMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });

        const points: THREE.Vector3[] = [];
        points.push(new THREE.Vector3(0, 0, 0));
        points.push(new THREE.Vector3(size, 0, 0));

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(geometry, material);
        this.add(line);

        line.position.set(0, 0.02, 0);

        const defaultRotation: number = GridConfig.GridOrientation === GridOrientation.PointyTop ? 0 : -Math.PI / 6;
        line.rotation.set(0, defaultRotation, 0);
    }

    private initRotationText(): void {
        const rotationText: Text = this.rotationText = this.createText('0');
        this.add(rotationText);

        rotationText.rotation.x = -Math.PI / 2;
        rotationText.position.set(0, 0.03, 0);

        const defaultRotation: number = GridConfig.GridOrientation === GridOrientation.PointyTop ? 0 : -Math.PI / 6;
        const quaternion = new THREE.Quaternion();
        quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), defaultRotation - Math.PI * 0.5);
        rotationText.quaternion.multiplyQuaternions(quaternion, rotationText.quaternion);

        const direction = new THREE.Vector3(Math.cos(-defaultRotation), 0, Math.sin(-defaultRotation));
        rotationText.position.addScaledVector(direction, 0.6);
    }

    private createText(textString: string, fontSize?: number, color?: number): Text {
        const text = new Text();
        text.text = textString;
        text.fontSize = fontSize || 0.23;
        text.anchorX = 'center';
        text.anchorY = 'middle';
        text.color = color || 0xaa0000;

        return text;
    }
}
