import * as THREE from 'three';
import { HexTilePartType } from '../../../../../Data/Enums/HexTilePartType';

export default abstract class HexTilePartAbstract extends THREE.Group {
    protected hexTilePartType: HexTilePartType;

    constructor(hexTilePartType: HexTilePartType) {
        super();

        this.hexTilePartType = hexTilePartType;
    }

    public abstract update(dt: number): void;

    public abstract reset(): void;

    public show(): void {
        this.visible = true;
    }

    public hide(): void {
        this.visible = false;
    }
}
