import * as THREE from 'three';
import CanvasPlaneMesh from '../../../../Helpers/CanvasPlaneMesh';
import { IWFCStep } from '../../../../Data/Interfaces/IWFC';
import HexGridHelper from '../../../../Helpers/HexGridHelper';
import { IHexCoord } from '../../../../Data/Interfaces/IHexTile';
import { GameConfig } from '../../../../Data/Configs/GameConfig';

export default class EntropyView extends THREE.Group {
    private steps: IWFCStep[];
    private radius: number;
    private entropyPlane: CanvasPlaneMesh;

    constructor(steps: IWFCStep[], radius: number) {
        super();

        this.steps = steps;
        this.radius = radius;

        this.init();
    }

    public drawStep(stepIndex: number): void {
        const freeCells = this.steps[stepIndex].freeCells;
        const lowestEntropyCells: IHexCoord[] = this.findLowestEntropyCells(stepIndex);

        const canvas = this.entropyPlane.getCanvas();
        const ctx = canvas.getContext('2d');
        const resolution = this.entropyPlane.getResolution();

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const canvasCenterX = canvas.width / 2;
        const canvasCenterY = canvas.height / 2;

        ctx.fillStyle = '#ffffff';
        ctx.font = `${0.45 * resolution}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (let q = -this.radius; q <= this.radius; q++) {
            const r1 = Math.max(-this.radius, -q - this.radius);
            const r2 = Math.min(this.radius, -q + this.radius);
            for (let r = r1; r <= r2; r++) {
                const center = HexGridHelper.axialToWorld({ q, r }, GameConfig.gameField.hexSize, GameConfig.gameField.GridOrientation);

                const cx = canvasCenterX + center.x * resolution;
                const cy = canvasCenterY + center.z * resolution;

                ctx.fillStyle = '#ffffff';
                if (lowestEntropyCells.some(cell => cell.q === q && cell.r === r)) {
                    ctx.fillStyle = '#ff0000';
                }

                const entropy = freeCells.find(cell => cell.position.q === q && cell.position.r === r)?.entropy;
                if (entropy !== undefined) {
                    ctx.fillText(`${entropy}`, cx, cy);
                }
            }
        }

        this.entropyPlane.updateTexture();
    }

    public reset(): void {
        if (this.entropyPlane) {
            this.entropyPlane.reset();
            this.remove(this.entropyPlane);
            this.entropyPlane = null;
        }
    }

    private findLowestEntropyCells(stepIndex: number): IHexCoord[] {
        const freeCells = this.steps[stepIndex].freeCells;

        const lowestEntropyCells: IHexCoord[] = [];
        let lowestEntropy: number = Infinity;

        for (const cell of freeCells) {
            if (cell.entropy < lowestEntropy) {
                lowestEntropy = cell.entropy;
                lowestEntropyCells.length = 0;
                lowestEntropyCells.push(cell.position);
            } else if (cell.entropy === lowestEntropy) {
                lowestEntropyCells.push(cell.position);
            }
        }

        return lowestEntropyCells;
    }

    private init(): void {
        const resolution = 25;
        const canvasMargin = 2;
        const worldSize = (3 / 2 * this.radius + canvasMargin) * GameConfig.gameField.hexSize;
        const entropyPlane = this.entropyPlane = new CanvasPlaneMesh(worldSize * 2, worldSize * 2, resolution);
        this.add(entropyPlane);

        const entropyPlaneView = entropyPlane.getView();
        entropyPlaneView.rotation.x = -Math.PI / 2;
        entropyPlaneView.position.set(0, 0.04, 0);
    }
}
