import { TileEdgeType } from "../Enums/TileEdgeType";
import { HexTileType } from "../Enums/HexTileType";
import { HexRotation } from "../Enums/HexRotation";
import { IHexCoord } from "./IHexTile";

export interface ITileVariant {
    type: HexTileType;
    rotation: HexRotation;
    edges: TileEdgeType[];
    weight: number;
}

export interface IWFCHexTilesInfo {
    coord: IHexCoord;
    possibleTiles: Set<HexTileType>;
    possibleRotations: Set<HexRotation>;
    possibleVariants: Set<ITileVariant>;
    collapsed: boolean;
    entropy: number;
    rotation?: HexRotation;
    type?: HexTileType;
}

export interface IHexTilesResult {
    type: HexTileType;
    rotation: HexRotation;
    position: IHexCoord;
}
