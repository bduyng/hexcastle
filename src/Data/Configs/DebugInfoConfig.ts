import { TileEdgeType } from "../Enums/TileEdgeType";
import { HexRotation } from "../Enums/HexRotation";
import { HexTileType } from "../Enums/HexTileType";

const RotationAngleName: { [key in HexRotation]: string } = {
    0: '0°',
    1: '60°',
    2: '120°',
    3: '180°',
    4: '240°',
    5: '300°'
}

const EdgeColor: { [key in TileEdgeType]: string } = {
    [TileEdgeType.Grass]: '#00aa00',
    [TileEdgeType.Road]: '#aa00aa',
    [TileEdgeType.Coast]: '#aaaa00',
    [TileEdgeType.Water]: '#0000aa',
    [TileEdgeType.River]: '#00aaaa',
}

const EdgesDebugHexTiles: HexTileType[] = [
    // Base tiles
    // HexTileType.Grass,
    // HexTileType.Water,

    // Roads
    // HexTileType.RoadA,
    // HexTileType.RoadB,
    // HexTileType.RoadC,
    // HexTileType.RoadD,
    // HexTileType.RoadE,
    // HexTileType.RoadF,
    // HexTileType.RoadG,
    // HexTileType.RoadH,
    // HexTileType.RoadI,
    // HexTileType.RoadJ,
    // HexTileType.RoadK,
    // HexTileType.RoadL,
    // HexTileType.RoadM,

    // Coasts
    // HexTileType.CoastA,
    // HexTileType.CoastB,
    // HexTileType.CoastC,
    // HexTileType.CoastD,
    // HexTileType.CoastE,

    // Rivers
    HexTileType.RiverA,
    HexTileType.RiverACurvy,
    HexTileType.RiverB,
    HexTileType.RiverC,
    HexTileType.RiverCrossingA,
    HexTileType.RiverCrossingB,
    HexTileType.RiverD,
    HexTileType.RiverE,
    HexTileType.RiverF,
    HexTileType.RiverG,
    HexTileType.RiverH,
    HexTileType.RiverI,
    HexTileType.RiverJ,
    HexTileType.RiverK,
    HexTileType.RiverL,
]

export { RotationAngleName, EdgeColor, EdgesDebugHexTiles };
