import * as THREE from 'three';
import { HexCoord } from '../Data/Interfaces/ICell';
import { GridOrientation } from '../Data/Enums/GridOrientation';

export default class HexGridHelper {
    constructor() {

    }

    public static axialToWorld({ q, r }: HexCoord, size: number, gridOrientation: GridOrientation): THREE.Vector3 {
        if (gridOrientation === GridOrientation.PointyTop) {
            const x = size * Math.sqrt(3) * (q + r / 2);
            const z = size * 1.5 * r;
            return new THREE.Vector3(x, 0, z);
        } else {
            const x = size * 1.5 * q;
            const z = size * Math.sqrt(3) * (r + q / 2);
            return new THREE.Vector3(x, 0, z);
        }
    }
}
