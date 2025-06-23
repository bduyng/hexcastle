import { HexTileType } from "../Enums/HexTileType";
import { IHexCoord } from "./IHexTile";

export interface IWallConfig {
    center: IHexCoord;
    radius: number;
    maxOffset: number;
}

export interface IWallGateConfig {
    type: HexTileType;
    replace: HexTileType;
    probability: number;
}