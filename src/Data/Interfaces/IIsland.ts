import { IHexCoord } from "./IHexTile";

export interface IIsland {
    tiles: IHexCoord[];
    center: IHexCoord;
    radius: number;
    area: number;
    perimeter: number;
    radiusAvailable: number;
}