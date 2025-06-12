import * as THREE from 'three';
import { IHexCoord } from '../Data/Interfaces/IHexTile';
import { GridOrientation } from '../Data/Enums/GridOrientation';
import HexTile from '../Scene/GameScene/HexTile/HexTile';
import { HexRotation } from '../Data/Enums/HexRotation';

export default class HexGridHelper {
    constructor() {

    }

    public static axialToWorld({ q, r }: IHexCoord, size: number, gridOrientation: GridOrientation): THREE.Vector3 {
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

    public static hexRotationToAngle(rotation: HexRotation): number {
        return (Math.PI / 3) * rotation;
    }

    public static setRotation(object: THREE.Object3D, rotation: HexRotation): void {
        object.rotation.set(0, (Math.PI / 3) * rotation, 0);
    }

    public static getHexTileByHexCoord(hexTiles: HexTile[], coord: IHexCoord): HexTile | null {
        for (const hexTile of hexTiles) {
            const position: IHexCoord = hexTile.getHexTilePosition();
            if (position.q === coord.q && position.r === coord.r) {
                return hexTile;
            }
        }

        return null;
    }
}
