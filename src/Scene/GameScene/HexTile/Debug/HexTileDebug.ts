import * as THREE from 'three';
import GridConfig from '../../../../Data/Configs/GridConfig';
import { HexRotation } from '../../../../Data/Enums/HexRotation';
import HexGridHelper from '../../../../Helpers/HexGridHelper';
import { EdgeColor, RotationAngleName } from '../../../../Data/Configs/DebugInfoConfig';
import { HexTileType } from '../../../../Data/Enums/HexTileType';
import { TileEdgeType } from '../../../../Data/Enums/TileEdgeType';
import DebugConfig from '../../../../Data/Configs/Debug/DebugConfig';
import CanvasPlaneMesh from '../../../../Helpers/CanvasPlaneMesh';
import { GridOrientation } from '../../../../Data/Enums/GridOrientation';
import { HexTilesRulesConfig } from '../../../../Data/Configs/HexTilesRulesConfig';

export default class HexTileDebug extends THREE.Group {
    private hexTileType: HexTileType;
    private debugInfoPlane: CanvasPlaneMesh;

    constructor(hexTileType: HexTileType) {
        super();

        this.hexTileType = hexTileType;

        this.init();
    }

    public setRotationText(rotation: HexRotation): void {
        HexGridHelper.setRotation(this.debugInfoPlane, rotation);
        this.drawInfo(rotation);
    }

    private init(): void {
        const debugInfoPlane = this.debugInfoPlane = new CanvasPlaneMesh(GridConfig.hexSize * 2, GridConfig.hexSize * 2, 200);
        this.add(debugInfoPlane);

        const debugInfoPlaneView = debugInfoPlane.getView();
        debugInfoPlaneView.rotation.x = -Math.PI / 2;
        debugInfoPlaneView.position.set(0, 0.03, 0);

        this.drawInfo(HexRotation.Rotate0);
    }

    private drawInfo(rotation: HexRotation): void {
        const resolution = this.debugInfoPlane.getResolution();
        const canvas = this.debugInfoPlane.getCanvas();
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (DebugConfig.game.hexTileDebug.rotation) {
            this.drawRotationInfo(canvas, resolution, rotation);
        }

        if (DebugConfig.game.hexTileDebug.edge) {
            this.drawEdgesInfo(canvas, resolution);
        }
    }

    private drawRotationInfo(canvas: HTMLCanvasElement, resolution: number, rotation: HexRotation): void {
        const textPosition: number = GridConfig.hexSize * 0.3;
        const color: string = '#aa0000';
        const startAngle = GridConfig.GridOrientation === GridOrientation.PointyTop ? 0 : Math.PI / 6;

        const canvasCenterX = canvas.width / 2;
        const canvasCenterY = canvas.height / 2;

        const ctx = canvas.getContext('2d');

        ctx.fillStyle = color;
        ctx.font = `${0.2 * resolution}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.save();
        ctx.translate(canvasCenterX, canvasCenterY);
        ctx.rotate(startAngle + Math.PI / 2);
        ctx.fillText(`${RotationAngleName[rotation]}`, 0, -GridConfig.hexSize * textPosition * resolution);
        ctx.restore();

        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(canvasCenterX, canvasCenterY);
        ctx.lineTo(canvasCenterX + Math.cos(startAngle) * GridConfig.hexSize * textPosition * resolution * 0.7,
                   canvasCenterY + Math.sin(startAngle) * GridConfig.hexSize * textPosition * resolution * 0.7);
        ctx.stroke();
    }

    private drawEdgesInfo(canvas: HTMLCanvasElement, resolution: number): void {
        const ctx = canvas.getContext('2d');

        const edgeTypes: TileEdgeType[] = this.getEdgeTypes(this.hexTileType);
        const edgeCount: number = edgeTypes.length;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        const startAngle = GridConfig.GridOrientation === GridOrientation.PointyTop ? 0 : Math.PI / 6;

        for (let i = 0; i < edgeCount; i++) {
            const angle = startAngle - (Math.PI / 3) * i;
            const edgeType: TileEdgeType = edgeTypes[i];
            const edgeColor: string = EdgeColor[edgeType];

            ctx.fillStyle = edgeColor;
            ctx.font = `${0.15 * resolution}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            const textX = centerX + Math.cos(angle) * GridConfig.hexSize * 0.7 * resolution;
            const textY = centerY + Math.sin(angle) * GridConfig.hexSize * 0.7 * resolution;

            ctx.save();
            ctx.translate(textX, textY);
            ctx.rotate(angle + Math.PI / 2);
            ctx.fillText(edgeType as string, 0, 0);
            ctx.restore();
        }
    }

    private getEdgeTypes(hexTileType: HexTileType): TileEdgeType[] {
        const hexTileRules = HexTilesRulesConfig.find(rule => rule.type === hexTileType);
        return hexTileRules ? hexTileRules.edges : [];
    }
}
