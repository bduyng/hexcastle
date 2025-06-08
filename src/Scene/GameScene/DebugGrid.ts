import * as THREE from 'three';
import GridConfig from '../../Data/Configs/GridConfig';
import { GridOrientation } from '../../Data/Enums/GridOrientation';
import HexGridHelper from '../../Helpers/HexGridHelper';

export default class DebugGrid extends THREE.Group {
    private radius: number;

    constructor(radius: number) {
        super();

        this.radius = radius;

        this.init();
    }

    private init(): void {
        this.initGrid();
        this.initGridCoordinates();
    }

    private initGrid(): void {
        const vertices: number[] = [];

        for (let q = -this.radius; q <= this.radius; q++) {
            const r1 = Math.max(-this.radius, -q - this.radius);
            const r2 = Math.min(this.radius, -q + this.radius);
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
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const resolution = 100;
        const canvasMargin = 2;

        const worldSize = (3 / 2 * this.radius + canvasMargin) * GridConfig.hexSize;

        const canvasWidth = Math.ceil(worldSize * resolution * 2);
        const canvasHeight = Math.ceil(worldSize * resolution * 2);

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        const canvasCenterX = canvas.width / 2;
        const canvasCenterY = canvas.height / 2;

        ctx.fillStyle = '#ffffff';
        ctx.font = `${0.2 * resolution}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (let q = -this.radius; q <= this.radius; q++) {
            const r1 = Math.max(-this.radius, -q - this.radius);
            const r2 = Math.min(this.radius, -q + this.radius);
            for (let r = r1; r <= r2; r++) {
                const center = HexGridHelper.axialToWorld({ q, r }, GridConfig.hexSize, GridConfig.GridOrientation);

                const cx = canvasCenterX + center.x * resolution;
                const cy = canvasCenterY + center.z * resolution - 0.5 * resolution;

                ctx.fillText(`q: ${q}, r: ${r}`, cx, cy);
            }
        }

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;

        const planeSize = Math.max(canvasWidth, canvasHeight) / resolution;
        const geometry = new THREE.PlaneGeometry(planeSize, planeSize);
        const material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });

        const gridPlane = new THREE.Mesh(geometry, material);
        this.add(gridPlane);

        gridPlane.rotation.x = -Math.PI / 2;
        gridPlane.position.set(0, 0.01, 0);
    }
}
