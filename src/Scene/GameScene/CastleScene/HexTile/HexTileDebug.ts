import * as THREE from 'three';
import { HexRotation } from '../../../../Data/Enums/HexRotation';
import HexGridHelper from '../../../../Helpers/HexGridHelper';
import { EdgeColor, RotationAngleName, TileDebugInfoConfigByCategory } from '../../../../Data/Configs/DebugInfoConfig';
import { HexTileType } from '../../../../Data/Enums/HexTileType';
import { TileEdgeType } from '../../../../Data/Enums/TileEdgeType';
import CanvasPlaneMesh from '../../../../Helpers/CanvasPlaneMesh';
import { GridOrientation } from '../../../../Data/Enums/GridOrientation';
import { HexTilesRulesConfig } from '../../../../Data/Configs/HexTilesRulesConfig';
import { IHexTileDebugConfig } from '../../../../Data/Interfaces/IHexTile';
import { GameConfig } from '../../../../Data/Configs/GameConfig';
import { HexTileCategory } from '../../../../Data/Enums/HexTileCategory';

export default class HexTileDebug extends THREE.Group {
    private hexTileType: HexTileType;
    private debugInfoPlane: CanvasPlaneMesh;
    private hexTileDebugConfig: IHexTileDebugConfig;
    private modelNamePlane: CanvasPlaneMesh;

    constructor(hexTileType: HexTileType, hexTileDebugConfig: IHexTileDebugConfig = null) {
        super();

        this.hexTileType = hexTileType;
        this.hexTileDebugConfig = hexTileDebugConfig;

        this.init();
    }

    public setRotation(rotation: HexRotation): void {
        HexGridHelper.setRotation(this.debugInfoPlane, rotation);
        this.drawInfo(rotation);
    }

    public show(): void {
        this.visible = true;
    }

    public hide(): void {
        this.visible = false;
    }

    public reset(): void {
        if (this.debugInfoPlane) {
            this.debugInfoPlane.reset();
            this.remove(this.debugInfoPlane);
        }

        if (this.modelNamePlane) {
            this.modelNamePlane.reset();
            this.remove(this.modelNamePlane);
        }
    }

    private init(): void {
        if (this.hexTileDebugConfig?.rotation || this.hexTileDebugConfig?.edge) {
            this.initDebugInfoPlane();
        }

        if (this.hexTileDebugConfig?.modelName) {
            this.initHexTileModelName();
        }
    }

    private initDebugInfoPlane(): void {
        const resolution: number = 70;
        const category: HexTileCategory = HexGridHelper.getCategoryByHexType(this.hexTileType);
        const tileDebugInfoConfigByType = TileDebugInfoConfigByCategory[category];

        const debugInfoPlane = this.debugInfoPlane = new CanvasPlaneMesh(GameConfig.gameField.hexSize * 2, GameConfig.gameField.hexSize * 2, resolution);
        this.add(debugInfoPlane);

        const debugInfoPlaneView = debugInfoPlane.getView();
        debugInfoPlaneView.rotation.x = -Math.PI / 2;
        debugInfoPlaneView.position.set(0, tileDebugInfoConfigByType.positionY, 0);

        this.drawInfo(HexRotation.Rotate0);
    }

    private drawInfo(rotation: HexRotation): void {
        const resolution = this.debugInfoPlane.getResolution();
        const canvas = this.debugInfoPlane.getCanvas();
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (this.hexTileDebugConfig?.rotation) {
            this.drawRotationInfo(canvas, resolution, rotation);
        }

        if (this.hexTileDebugConfig?.edge) {
            this.drawEdgesInfo(canvas, resolution);
        }
    }

    private drawRotationInfo(canvas: HTMLCanvasElement, resolution: number, rotation: HexRotation): void {
        const textPosition: number = GameConfig.gameField.hexSize * 0.3;
        const color: string = '#aa0000';
        const startAngle = GameConfig.gameField.GridOrientation === GridOrientation.PointyTop ? 0 : Math.PI / 6;

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
        ctx.fillText(`${RotationAngleName[rotation]}`, 0, -GameConfig.gameField.hexSize * textPosition * resolution);
        ctx.restore();

        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(canvasCenterX, canvasCenterY);
        ctx.lineTo(canvasCenterX + Math.cos(startAngle) * GameConfig.gameField.hexSize * textPosition * resolution * 0.7,
            canvasCenterY + Math.sin(startAngle) * GameConfig.gameField.hexSize * textPosition * resolution * 0.7);
        ctx.stroke();
    }

    private drawEdgesInfo(canvas: HTMLCanvasElement, resolution: number): void {
        const ctx = canvas.getContext('2d');

        const edgeTypes: TileEdgeType[] = this.getEdgeTypes(this.hexTileType);
        const edgeCount: number = edgeTypes.length;

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        const startAngle = GameConfig.gameField.GridOrientation === GridOrientation.PointyTop ? 0 : Math.PI / 6;

        for (let i = 0; i < edgeCount; i++) {
            const angle = startAngle - (Math.PI / 3) * i;
            const edgeType: TileEdgeType = edgeTypes[i];
            const edgeColor: string = EdgeColor[edgeType];

            ctx.fillStyle = edgeColor;
            ctx.font = `${0.15 * resolution}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            const textX = centerX + Math.cos(angle) * GameConfig.gameField.hexSize * 0.7 * resolution;
            const textY = centerY + Math.sin(angle) * GameConfig.gameField.hexSize * 0.7 * resolution;

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

    private initHexTileModelName(): void {
        const modelNamePlane = this.modelNamePlane = new CanvasPlaneMesh(GameConfig.gameField.hexSize * 4, GameConfig.gameField.hexSize * 4, 200);
        this.add(modelNamePlane);

        const debugInfoPlaneView = modelNamePlane.getView();
        debugInfoPlaneView.rotation.x = -Math.PI / 2;
        debugInfoPlaneView.position.set(0, 0.03, -1.4);

        const canvas = modelNamePlane.getCanvas();
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const resolution = modelNamePlane.getResolution();
        ctx.fillStyle = '#000000';
        ctx.font = `${0.28 * resolution}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.hexTileType, canvas.width / 2, canvas.height / 2);
    }
}
