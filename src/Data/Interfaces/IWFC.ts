import { EdgeType } from "../Enums/EdgeType";
import { GroundCellType } from "../Enums/GroundCellType";
import { HexRotation } from "../Enums/HexRotation";
import { IHexCoord } from "./ICell";

export interface ITileVariant {
    type: GroundCellType;
    rotation: HexRotation;
    edges: EdgeType[];
    weight: number;
}

export interface IWFCCellInfo {
    coord: IHexCoord;
    possibleTiles: Set<GroundCellType>;
    possibleRotations: Set<HexRotation>;
    possibleVariants: Set<ITileVariant>;
    collapsed: boolean;
    entropy: number;
    rotation?: HexRotation;
    type?: GroundCellType;
}

export interface ICellResult {
    type: GroundCellType;
    rotation: HexRotation;
    position: IHexCoord;
}
