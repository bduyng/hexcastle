import * as THREE from 'three';
import { GameConfig } from '../../../Data/Configs/GameConfig';
import { IHexCoord } from '../../../Data/Interfaces/IHexTile';
import { GridOrientation } from '../../../Data/Enums/GridOrientation';
import HexGridHelper from '../../../Helpers/HexGridHelper';
import TWEEN from 'three/addons/libs/tween.module.js';

export default class FieldRadiusHelper extends THREE.Group {
    private radius: number;
    private view: THREE.Mesh;
    private hideTween: any;
    private epsilon: number = 1e-5;

    constructor() {
        super();
    }

    public show(radius: number): void {
        this.radius = radius;

        if (this.hideTween) {
            this.hideTween.stop();
            this.hideTween = null;
        }

        this.reset();
        this.createPerimeterPlane();
    }

    public hide(): void {
        this.hideTween = new TWEEN.Tween(this.view.material)
            .to({ opacity: 0 }, 1000)
            .easing(TWEEN.Easing.Sinusoidal.In)
            .start()
            .onComplete(() => {
                this.view.visible = false;
            });
    }

    private reset(): void {
        if (this.view) {
            this.remove(this.view);
            this.view.geometry.dispose();
            this.view = null;
        }
    }

    private getOuterVertices(): THREE.Vector2[] {
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

    private createPerimeterPlane(): void {
        const vertices = this.getOuterVertices();

        const lowerVertices: THREE.Vector3[] = [];
        const upperVertices: THREE.Vector3[] = [];

        for (const vertex of vertices) {
            lowerVertices.push(new THREE.Vector3(vertex.x, 0.4, vertex.y));
            upperVertices.push(new THREE.Vector3(vertex.x, -1, vertex.y));
        }

        const positions: number[] = [];
        const uvs: number[] = [];
        const indices: number[] = [];

        let vertexIndex = 0;

        for (let i = 0; i < vertices.length; i++) {
            const nextI = (i + 1) % vertices.length;

            const v1 = lowerVertices[i];
            const v2 = lowerVertices[nextI];
            const v3 = upperVertices[nextI];
            const v4 = upperVertices[i];

            positions.push(v1.x, v1.y, v1.z);
            positions.push(v2.x, v2.y, v2.z);
            positions.push(v3.x, v3.y, v3.z);

            uvs.push(0, 0);
            uvs.push(1, 0);
            uvs.push(1, 1);

            indices.push(vertexIndex, vertexIndex + 1, vertexIndex + 2);

            positions.push(v1.x, v1.y, v1.z);
            positions.push(v3.x, v3.y, v3.z);
            positions.push(v4.x, v4.y, v4.z);

            uvs.push(0, 0);
            uvs.push(1, 1);
            uvs.push(0, 1);

            indices.push(vertexIndex + 3, vertexIndex + 4, vertexIndex + 5);

            vertexIndex += 6;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        geometry.setIndex(indices);
        geometry.computeVertexNormals();

        const material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide,
        });

        const view = this.view = new THREE.Mesh(geometry, material);
        this.add(view);
    }
}
