import * as THREE from 'three';
import { GameConfig } from '../../../Data/Configs/GameConfig';
import { IHexCoord } from '../../../Data/Interfaces/IHexTile';
import { GridOrientation } from '../../../Data/Enums/GridOrientation';
import HexGridHelper from '../../../Helpers/HexGridHelper';

export default class FieldRadiusHelper extends THREE.Group {
    private radius: number;
    private epsilon: number = 1e-5;

    constructor(radius: number = 0) {
        super();

        this.radius = radius;

        this.init();
    }

    private init(): void {

    }

    public getOuterVertices(): THREE.Vector2[] {
        const hexCoords = this.generateHexCoords();
        const outerVertices: THREE.Vector2[] = [];

        for (const coord of hexCoords) {
            const hexCenter = HexGridHelper.axialToWorld(coord, GameConfig.gameField.hexSize, GameConfig.gameField.GridOrientation);
            const hexVertices = this.getHexVertices(hexCenter);

            for (let side = 0; side < 6; side++) {
                const neighborCoord = this.getNeighborCoord(coord, side);

                if (!this.isCoordInField(neighborCoord, hexCoords)) {
                    const vertex1 = hexVertices[side];
                    const vertex2 = hexVertices[(side + 1) % 6];

                    this.addUniqueVertex(outerVertices, vertex1);
                    this.addUniqueVertex(outerVertices, vertex2);
                }
            }
        }

        return this.sortVerticesByAngle(outerVertices);
    }

    private generateHexCoords(): IHexCoord[] {
        const coords: IHexCoord[] = [];

        for (let q = -this.radius; q <= this.radius; q++) {
            const r1 = Math.max(-this.radius, -q - this.radius);
            const r2 = Math.min(this.radius, -q + this.radius);

            for (let r = r1; r <= r2; r++) {
                coords.push({ q, r });
            }
        }

        return coords;
    }

    private getHexVertices(center: THREE.Vector3): THREE.Vector2[] {
        const vertices: THREE.Vector2[] = [];

        for (let i = 0; i < 6; i++) {
            let angle: number;

            if (GameConfig.gameField.GridOrientation === GridOrientation.PointyTop) {
                angle = Math.PI / 3 * i - Math.PI / 6;
            } else {
                angle = Math.PI / 3 * i;
            }

            const x = center.x + GameConfig.gameField.hexSize * Math.cos(angle);
            const z = center.z + GameConfig.gameField.hexSize * Math.sin(angle);

            vertices.push(new THREE.Vector2(x, z));
        }

        return vertices;
    }

    private getNeighborCoord(coord: IHexCoord, side: number): IHexCoord {
        const directions: IHexCoord[] = [
            { q: 1, r: 0 },   // 0: восток
            { q: 0, r: 1 },   // 1: юго-восток
            { q: -1, r: 1 },  // 2: юго-запад
            { q: -1, r: 0 },  // 3: запад
            { q: 0, r: -1 },  // 4: северо-запад
            { q: 1, r: -1 }   // 5: северо-восток
        ];

        const directions2: IHexCoord[] = [
            { q: 1, r: 0 },   // 0°
            { q: 1, r: -1 },  // 60°
            { q: 0, r: -1 },  // 120°
            { q: -1, r: 0 },  // 180°
            { q: -1, r: 1 },  // 240°
            { q: 0, r: 1 },   // 300°
        ];

        const direction = directions[side];
        return {
            q: coord.q + direction.q,
            r: coord.r + direction.r
        };
    }

    private isCoordInField(coord: IHexCoord, hexCoords: IHexCoord[]): boolean {
        return hexCoords.some(c => c.q === coord.q && c.r === coord.r);
    }

    private addUniqueVertex(vertices: THREE.Vector2[], newVertex: THREE.Vector2): void {
        const exists = vertices.some(vertex =>
            Math.abs(vertex.x - newVertex.x) < this.epsilon &&
            Math.abs(vertex.y - newVertex.y) < this.epsilon
        );

        if (!exists) {
            vertices.push(newVertex.clone());
        }
    }

    private sortVerticesByAngle(vertices: THREE.Vector2[]): THREE.Vector2[] {
        const center = this.calculateCenter(vertices);

        return vertices.sort((a, b) => {
            const angleA = Math.atan2(a.y - center.y, a.x - center.x);
            const angleB = Math.atan2(b.y - center.y, b.x - center.x);
            return angleA - angleB;
        });
    }

    private calculateCenter(vertices: THREE.Vector2[]): THREE.Vector2 {
        if (vertices.length === 0) return new THREE.Vector2(0, 0);

        const center = new THREE.Vector2(0, 0);
        for (const vertex of vertices) {
            center.add(vertex);
        }
        center.divideScalar(vertices.length);

        return center;
    }

    public createVerticesVisualization(color: number = 0x0000ff, size: number = 0.05): THREE.Points {
        const vertices = this.getOuterVertices();
        const points: THREE.Vector3[] = [];

        for (const vertex of vertices) {
            points.push(new THREE.Vector3(vertex.x, 0.15, vertex.y)); // Y=0.15 чтобы точки были видны над землей
        }

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.PointsMaterial({
            color: color,
            size: size,
            sizeAttenuation: false
        });

        const pointsObject = new THREE.Points(geometry, material);
        pointsObject.name = 'FieldVertices';

        return pointsObject;
    }
}
