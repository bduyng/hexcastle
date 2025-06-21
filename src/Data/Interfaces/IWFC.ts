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

export interface IPredefinedTile {
    coord: IHexCoord;
    type: HexTileType;
    rotation: HexRotation;
}

export interface IHexTilesResult {
    type: HexTileType;
    rotation: HexRotation;
    position: IHexCoord;
}

export interface IWFCConfig {
    radius: number;
    hexTileTypesUsed: HexTileType[];
    predefinedTiles?: IPredefinedTile[];
}

export interface IWFCStep {
    newTile?: {
        position: IHexCoord;
        type: HexTileType;
        rotation: HexRotation;
    };
    freeCells: {
        position: IHexCoord;
        entropy: number;
        possibleVariants: ITileVariant[];
    }[];
}

export interface IWFCProgressCallback {
    (stepIndex: number): void;
}

export interface IWFCAsyncResult {
    success: boolean;
    grid?: IHexTilesResult[];
    steps?: IWFCStep[];
    error?: string;
}
