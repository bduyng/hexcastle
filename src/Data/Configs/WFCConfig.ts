import { TileEdgeType } from "../Enums/TileEdgeType";
import { HexTileType } from "../Enums/HexTileType";
import { IHexTilesRule } from "../Interfaces/IBaseSceneData";
import { IHexCoord } from "../Interfaces/IHexTile";

const HexTilesRulesConfig: IHexTilesRule[] = [
    // {
    //     type: HexTileType.Grass,
    //     edges: [
    //         EdgeType.Grass,
    //         EdgeType.Grass,
    //         EdgeType.Grass,
    //         EdgeType.Grass,
    //         EdgeType.Grass,
    //         EdgeType.Grass,
    //     ],
    //     weight: 1,
    // },
    {
        type: HexTileType.RoadA,
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
            TileEdgeType.Road,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
            TileEdgeType.Road,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
        ],
        weight: 1,
    },
    {
        type: HexTileType.RoadB,
        edges: [
            TileEdgeType.Road,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
            TileEdgeType.Road,
            TileEdgeType.Grass,
        ],
        weight: 1,
    },
    {
        type: HexTileType.RoadC,
        edges: [
            TileEdgeType.Road,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
            TileEdgeType.Road,
        ],
        weight: 1,
    },
    {
        type: HexTileType.RoadD,
        edges: [
            TileEdgeType.Road,
            TileEdgeType.Grass,
            TileEdgeType.Road,
            TileEdgeType.Grass,
            TileEdgeType.Road,
            TileEdgeType.Grass,
        ],
        weight: 1,
    },
    {
        type: HexTileType.RoadE,
        edges: [
            TileEdgeType.Road,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
            TileEdgeType.Road,
            TileEdgeType.Road,
            TileEdgeType.Grass,
        ],
        weight: 1,
    },
    {
        type: HexTileType.RoadF,
        edges: [
            TileEdgeType.Road,
            TileEdgeType.Grass,
            TileEdgeType.Road,
            TileEdgeType.Road,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
        ],
        weight: 1,
    },
    {
        type: HexTileType.RoadM,
        edges: [
            TileEdgeType.Road,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
        ],
        weight: 1,
    },
];

const NeighborDirections: IHexCoord[] = [
    { q: 1, r: 0 },   // 0°
    { q: 1, r: -1 },  // 60°
    { q: 0, r: -1 },  // 120°
    { q: -1, r: 0 },  // 180°
    { q: -1, r: 1 },  // 240°
    { q: 0, r: 1 },   // 300°
];


export { NeighborDirections, HexTilesRulesConfig };
