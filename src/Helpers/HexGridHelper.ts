import * as THREE from 'three';
import { IHexCoord } from '../Data/Interfaces/IHexTile';
import { GridOrientation } from '../Data/Enums/GridOrientation';
import HexTile from '../Scene/GameScene/CastleScene/HexTile/HexTile';
import { HexRotation } from '../Data/Enums/HexRotation';
import { HexTileType } from '../Data/Enums/HexTileType';
import { HexTileCategory } from '../Data/Enums/HexTileCategory';
import { HexTilesByCategory } from '../Data/Configs/HexTilesByCategory';

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

    public static getCountByRadius(radius: number): number {
        return (3 * radius * (radius + 1)) + 1;
    }

    public static getCategoryByHexType(hexType: HexTileType): HexTileCategory {
        for (const category in HexTilesByCategory) {
            const tiles = HexTilesByCategory[category as HexTileCategory];
            if (tiles.includes(hexType)) {
                return category as HexTileCategory;
            }
        }

        return null;
    }

    public static getHexNeighbors(coord: IHexCoord): IHexCoord[] {
        return [
            { q: coord.q + 1, r: coord.r },     // 0°
            { q: coord.q + 1, r: coord.r - 1 }, // 60°
            { q: coord.q, r: coord.r - 1 },     // 120°
            { q: coord.q - 1, r: coord.r },     // 180°
            { q: coord.q - 1, r: coord.r + 1 }, // 240°
            { q: coord.q, r: coord.r + 1 },     // 300°
        ];
    }

    public static isPositionsEqual(coord1: IHexCoord, coord2: IHexCoord): boolean {
        return coord1.q === coord2.q && coord1.r === coord2.r;
    }

    public static removeSameTiles(hexTiles1: IHexCoord[], hexTiles2: IHexCoord[]): IHexCoord[] {
        return hexTiles1.filter(tile1 => {
            return !hexTiles2.some(tile2 => this.isPositionsEqual(tile1, tile2));
        });
    }

    public static getHexDistance(coord: IHexCoord): number {
        return Math.max(Math.abs(coord.q), Math.abs(coord.r), Math.abs(-coord.q - coord.r));
    }

    public static isHexOnRadiusEdge(coord: IHexCoord, radius: number): boolean {
        return this.getHexDistance(coord) === radius;
    }

    public static getAllHexCoordsInRadius(radius: number): IHexCoord[] {
        const coords: IHexCoord[] = [];
        
        for (let q = -radius; q <= radius; q++) {
            const r1 = Math.max(-radius, -q - radius);
            const r2 = Math.min(radius, -q + radius);
            
            for (let r = r1; r <= r2; r++) {
                coords.push({ q, r });
            }
        }
        
        return coords;
    }
}
