import { HexRotation } from "../Enums/HexRotation";
import { HexTileType } from "../Enums/HexTileType";

export interface IHexCoord {
    q: number;
    r: number;
}

export interface IHexTileModelConfig {
    modelName: string;
    color?: number;
}

export interface IHexTileTransform {
    position: IHexCoord;
    rotation: HexRotation;
}

export interface IHexTileInstanceData {
    type: HexTileType;
    transforms: IHexTileTransform[];
}