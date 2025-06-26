import { TileEdgeType } from "../Enums/TileEdgeType";
import { HexTileType } from "../Enums/HexTileType";
import { IHexTilesRule } from "../Interfaces/IBaseSceneData";

const WallTilesRulesConfig: IHexTilesRule[] = [
    {
        type: HexTileType.WallCornerAGate,
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
            TileEdgeType.Wall,
            TileEdgeType.Outside,
            TileEdgeType.Outside,
            TileEdgeType.Outside,
            TileEdgeType.Wall,
            TileEdgeType.Inside,
        ],
    },
    {
        type: HexTileType.WallCornerAInside,
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
            TileEdgeType.Wall,
            TileEdgeType.Inside,
            TileEdgeType.Inside,
            TileEdgeType.Inside,
            TileEdgeType.Wall,
            TileEdgeType.Outside,
        ],
    },
    {
        type: HexTileType.WallCornerAOutside,
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
            TileEdgeType.Wall,
            TileEdgeType.Outside,
            TileEdgeType.Outside,
            TileEdgeType.Outside,
            TileEdgeType.Wall,
            TileEdgeType.Inside,
        ],
    },
    {
        type: HexTileType.WallCornerBInside,
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
            TileEdgeType.Wall,
            TileEdgeType.Inside,
            TileEdgeType.Inside,
            TileEdgeType.Inside,
            TileEdgeType.Inside,
            TileEdgeType.Wall,
        ],
    },
    {
        type: HexTileType.WallCornerBOutside,
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
            TileEdgeType.Wall,
            TileEdgeType.Outside,
            TileEdgeType.Outside,
            TileEdgeType.Outside,
            TileEdgeType.Outside,
            TileEdgeType.Wall,
        ],
    },
    {
        type: HexTileType.WallStraight,
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
            TileEdgeType.Wall,
            TileEdgeType.Outside,
            TileEdgeType.Outside,
            TileEdgeType.Wall,
            TileEdgeType.Inside,
            TileEdgeType.Inside,
        ],
    },
    {
        type: HexTileType.WallStraightGate,
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
            TileEdgeType.Wall,
            TileEdgeType.Outside,
            TileEdgeType.Outside,
            TileEdgeType.Wall,
            TileEdgeType.Inside,
            TileEdgeType.Inside,
        ],
    },
];

export { WallTilesRulesConfig };
