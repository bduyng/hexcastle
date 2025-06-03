import * as THREE from 'three';
import GridConfig from '../../Data/Configs/GridConfig';
import { GridOrientation } from '../../Data/Enums/GridOrientation';
import HexGridHelper from '../../Helpers/HexGridHelper';

export default class DebugGrid extends THREE.Group {
    constructor() {
        super();

        this.init();
    }

    private init(): void {
        this.initGrid();
        this.initGridCoordinates();
    }

    private initGrid(): void {
        const gridRadius: number = GridConfig.gridRadius;
        const vertices: number[] = [];

        for (let q = -gridRadius; q <= gridRadius; q++) {
            const r1 = Math.max(-gridRadius, -q - gridRadius);
            const r2 = Math.min(gridRadius, -q + gridRadius);
            for (let r = r1; r <= r2; r++) {
                const center = HexGridHelper.axialToWorld({ q, r }, GridConfig.hexSize, GridConfig.GridOrientation);
                const corners = this.getHexCorners(center, GridConfig.hexSize, GridConfig.GridOrientation);

                for (let i = 0; i < 6; i++) {
                    const a = corners[i];
                    const b = corners[(i + 1) % 6];
                    vertices.push(a.x, a.y, a.z, b.x, b.y, b.z);
                }

                const midX = (corners[0].x + corners[1].x) / 2;
                const midY = (corners[0].y + corners[1].y) / 2;
                const midZ = (corners[0].z + corners[1].z) / 2;
                vertices.push(center.x, center.y, center.z, midX, midY, midZ);
            }
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        const material = new THREE.LineBasicMaterial({ color: 0x00ffff });
        const grid = new THREE.LineSegments(geometry, material);
        this.add(grid);
    }

    private getHexCorners(center: THREE.Vector3, size: number, gridOrientation: GridOrientation): THREE.Vector3[] {
        const corners: THREE.Vector3[] = [];
        const angleOffset = gridOrientation === GridOrientation.PointyTop ? -30 : 0;

        for (let i = 0; i < 6; i++) {
            const angleDeg = 60 * i + angleOffset;
            const angleRad = THREE.MathUtils.degToRad(angleDeg);
            const x = center.x + size * Math.cos(angleRad);
            const z = center.z + size * Math.sin(angleRad);
            corners.push(new THREE.Vector3(x, center.y, z));
        }

        return corners;
    }

    private initGridCoordinates(): void {
        
    }
}
