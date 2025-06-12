import { HexTileType } from "../Enums/HexTileType";
import { IHexCoord } from "../Interfaces/IHexTile";

const WFCTiles: HexTileType[] = [
    // HexTileType.Grass,
    HexTileType.RoadA,
    HexTileType.RoadB,
    HexTileType.RoadC,
    HexTileType.RoadD,
    HexTileType.RoadE,
    HexTileType.RoadF,
    HexTileType.RoadG,
    HexTileType.RoadH,
    HexTileType.RoadI,
    HexTileType.RoadJ,
    HexTileType.RoadK,
    HexTileType.RoadL,
    HexTileType.RoadM,
];

const NeighborDirections: IHexCoord[] = [
    { q: 1, r: 0 },   // 0°
    { q: 1, r: -1 },  // 60°
    { q: 0, r: -1 },  // 120°
    { q: -1, r: 0 },  // 180°
    { q: -1, r: 1 },  // 240°
    { q: 0, r: 1 },   // 300°
];

export { NeighborDirections, WFCTiles };
