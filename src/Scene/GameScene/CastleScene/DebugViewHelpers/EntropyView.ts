import * as THREE from 'three';
import CanvasPlaneMesh from '../../../../Helpers/CanvasPlaneMesh';
import { IWFCStep } from '../../../../Data/Interfaces/IWFC';
import GridConfig from '../../../../Data/Configs/GridConfig';
import HexGridHelper from '../../../../Helpers/HexGridHelper';

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
        // console.log('Step', stepIndex, 'Free cells:', freeCells);

        const canvas = this.entropyPlane.getCanvas();
        const ctx = canvas.getContext('2d');
        const resolution = this.entropyPlane.getResolution();

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const canvasCenterX = canvas.width / 2;
        const canvasCenterY = canvas.height / 2;

        ctx.fillStyle = '#ff0000';
        ctx.font = `${0.5 * resolution}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (let q = -this.radius; q <= this.radius; q++) {
            const r1 = Math.max(-this.radius, -q - this.radius);
            const r2 = Math.min(this.radius, -q + this.radius);
            for (let r = r1; r <= r2; r++) {
                const center = HexGridHelper.axialToWorld({ q, r }, GridConfig.hexSize, GridConfig.GridOrientation);

                const cx = canvasCenterX + center.x * resolution;
                const cy = canvasCenterY + center.z * resolution;

                const entropy = freeCells.find(cell => cell.position.q === q && cell.position.r === r)?.entropy;
                if (entropy !== undefined) {
                    // console.log(`Cell (${q},${r}) entropy:`, entropy, 'possible variants:', freeCells.find(cell => cell.position.q === q && cell.position.r === r)?.possibleVariants.length);
                    ctx.fillText(`${entropy}`, cx, cy);
                }
            }
        }

        this.entropyPlane.updateTexture();
    }

    private init(): void {
        const resolution = 200;
        const canvasMargin = 2;
        const worldSize = (3 / 2 * this.radius + canvasMargin) * GridConfig.hexSize;
        const entropyPlane = this.entropyPlane = new CanvasPlaneMesh(worldSize * 2, worldSize * 2, resolution);
        this.add(entropyPlane);

        const entropyPlaneView = entropyPlane.getView();
        entropyPlaneView.rotation.x = -Math.PI / 2;
        entropyPlaneView.position.set(0, 0.04, 0);
    }
}
