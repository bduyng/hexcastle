import { TileEdgeType } from "../Enums/TileEdgeType";
import { HexTileType } from "../Enums/HexTileType";
import { IHexTilesRule } from "../Interfaces/IBaseSceneData";

const HexTilesRulesConfig: IHexTilesRule[] = [
    {
        type: HexTileType.Grass,
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
            TileEdgeType.Grass,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
        ],
        weight: 1,
    },
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
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
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
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
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
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
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
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
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
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
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
        type: HexTileType.RoadG,
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
            TileEdgeType.Road,
            TileEdgeType.Road,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
            TileEdgeType.Road,
        ],
        weight: 1,
    },
    {
        type: HexTileType.RoadH,
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
            TileEdgeType.Road,
            TileEdgeType.Road,
            TileEdgeType.Grass,
            TileEdgeType.Road,
            TileEdgeType.Grass,
            TileEdgeType.Road,
        ],
        weight: 1,
    },
    {
        type: HexTileType.RoadI,
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
            TileEdgeType.Grass,
            TileEdgeType.Road,
            TileEdgeType.Road,
            TileEdgeType.Grass,
            TileEdgeType.Road,
            TileEdgeType.Road,
        ],
        weight: 1,
    },
    {
        type: HexTileType.RoadJ,
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
            TileEdgeType.Road,
            TileEdgeType.Road,
            TileEdgeType.Road,
            TileEdgeType.Road,
            TileEdgeType.Grass,
            TileEdgeType.Grass,
        ],
        weight: 1,
    },
    {
        type: HexTileType.RoadK,
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
            TileEdgeType.Road,
            TileEdgeType.Road,
            TileEdgeType.Road,
            TileEdgeType.Grass,
            TileEdgeType.Road,
            TileEdgeType.Road,
        ],
        weight: 1,
    },
    {
        type: HexTileType.RoadL,
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
            TileEdgeType.Road,
            TileEdgeType.Road,
            TileEdgeType.Road,
            TileEdgeType.Road,
            TileEdgeType.Road,
            TileEdgeType.Road,
        ],
        weight: 1,
    },
    {
        type: HexTileType.RoadM,
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
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

export { HexTilesRulesConfig };
