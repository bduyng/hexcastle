import { HexTileType } from "../Enums/HexTileType";
import { IWallGateConfig } from "../Interfaces/IWall";

const WallTileTypes: HexTileType[] = [
    HexTileType.WallCornerAInside,
    HexTileType.WallCornerAOutside,
    HexTileType.WallCornerBInside,
    HexTileType.WallCornerBOutside,
    HexTileType.WallStraight,
];

const WallGateTiles: IWallGateConfig[] = [
    {
        type: HexTileType.WallCornerAGate,
        replace: HexTileType.WallCornerAOutside,
        probability: 0.3,
    },
    {
        type: HexTileType.WallStraightGate,
        replace: HexTileType.WallStraight,
        probability: 0.3,
    },
]

export { WallTileTypes, WallGateTiles };
