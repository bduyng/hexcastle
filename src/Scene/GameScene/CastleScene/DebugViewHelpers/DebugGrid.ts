import * as THREE from 'three';
import { GridOrientation } from '../../../../Data/Enums/GridOrientation';
import HexGridHelper from '../../../../Helpers/HexGridHelper';
import CanvasPlaneMesh from '../../../../Helpers/CanvasPlaneMesh';
import { GameConfig } from '../../../../Data/Configs/GameConfig';

export default class DebugGrid extends THREE.Group {
    private radius: number;
    private grid: THREE.LineSegments;
    private gridCoordinatesPlane: CanvasPlaneMesh;

    constructor() {
        super();

    }

    public create(radius: number): void {
        this.radius = radius;

        this.reset();

        this.initGrid();
        this.initGridCoordinates();
    }

    private reset(): void {
        if (this.grid) {
            this.remove(this.grid);
            this.grid.geometry.dispose();
        }

        if (this.gridCoordinatesPlane) {
            this.remove(this.gridCoordinatesPlane);
            this.gridCoordinatesPlane.getCanvas().remove();
        }
    }

    private initGrid(): void {
        const vertices: number[] = [];

        for (let q = -this.radius; q <= this.radius; q++) {
            const r1 = Math.max(-this.radius, -q - this.radius);
            const r2 = Math.min(this.radius, -q + this.radius);
            for (let r = r1; r <= r2; r++) {
                const center = HexGridHelper.axialToWorld({ q, r }, GameConfig.gameField.hexSize, GameConfig.gameField.GridOrientation);
                const corners = this.getHexCorners(center, GameConfig.gameField.hexSize, GameConfig.gameField.GridOrientation);

                for (let i = 0; i < 6; i++) {
                    const a = corners[i];
                    const b = corners[(i + 1) % 6];
                    vertices.push(a.x, a.y, a.z, b.x, b.y, b.z);
                }

                if (q === 0 && r === 0) {
                    const midX = (corners[0].x + corners[1].x) / 2;
                    const midY = (corners[0].y + corners[1].y) / 2;
                    const midZ = (corners[0].z + corners[1].z) / 2;
                    vertices.push(center.x, center.y, center.z, midX, midY, midZ);
                }
            }
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        const material = new THREE.LineBasicMaterial({ color: 0x00ffff });
        const grid = this.grid = new THREE.LineSegments(geometry, material);
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
        const resolution = 50;
        const canvasMargin = 2;
        const worldSize = (3 / 2 * this.radius + canvasMargin) * GameConfig.gameField.hexSize;
        const gridCoordinatesPlane = this.gridCoordinatesPlane = new CanvasPlaneMesh(worldSize * 2, worldSize * 2, resolution);
        this.add(gridCoordinatesPlane);

        const gridCoordinatesPlaneView = gridCoordinatesPlane.getView();
        gridCoordinatesPlaneView.rotation.x = -Math.PI / 2;
        gridCoordinatesPlaneView.position.set(0, 0.03, 0);

        const canvas = gridCoordinatesPlane.getCanvas();
        const ctx = canvas.getContext('2d');

        const canvasCenterX = canvas.width / 2;
        const canvasCenterY = canvas.height / 2;

        ctx.fillStyle = '#ffffff';
        ctx.font = `${0.25 * resolution}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (let q = -this.radius; q <= this.radius; q++) {
            const r1 = Math.max(-this.radius, -q - this.radius);
            const r2 = Math.min(this.radius, -q + this.radius);
            for (let r = r1; r <= r2; r++) {
                const center = HexGridHelper.axialToWorld({ q, r }, GameConfig.gameField.hexSize, GameConfig.gameField.GridOrientation);

                const cx = canvasCenterX + center.x * resolution;
                const cy = canvasCenterY + center.z * resolution - 0.55 * resolution;

                ctx.fillText(`q: ${q}, r: ${r}`, cx, cy);
            }
        }
    }
}
