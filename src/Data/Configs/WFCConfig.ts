import { HexTileType } from "../Enums/HexTileType";
import { IHexCoord } from "../Interfaces/IHexTile";
import { IWFCConfig } from "../Interfaces/IWFC";
import { GameConfig } from "./GameConfig";

const WFCTiles: HexTileType[] = [
    // Base tiles
    HexTileType.Grass,
    HexTileType.Water,

    HexTileType.RoadA, // 2 road edges
    HexTileType.RoadB, // 2 road edges
    // HexTileType.RoadC, // 2 road edges
        // HexTileType.RoadD, // 3 road edges
        // HexTileType.RoadE, // 3 road edges
        // HexTileType.RoadF, // 3 road edges
        // HexTileType.RoadG, // 3 road edges
        // HexTileType.RoadH, // 4 road edges
        // HexTileType.RoadI, // 4 road edges
        // HexTileType.RoadJ, // 4 road edges
        // HexTileType.RoadK, // 5 road edges
        // HexTileType.RoadL, // 6 road edges
        // HexTileType.RoadM, // 1 road edges

    HexTileType.CoastA,
    HexTileType.CoastB,
    HexTileType.CoastC,
    HexTileType.CoastD,
        // HexTileType.CoastE, - dont use

    HexTileType.RiverA, // 2 river edges
    HexTileType.RiverACurvy, // 2 river edges
    HexTileType.RiverB, // 2 river edges
    // HexTileType.RiverC, // 3 river edges
        // HexTileType.RiverCrossingA, // 2 river edges
        // HexTileType.RiverCrossingB, // 2 river edges
        // HexTileType.RiverD, // 3 river edges
        // HexTileType.RiverE, // 3 river edges
        // HexTileType.RiverF, // 3 river edges
        // HexTileType.RiverG, // 3 river edges
        // HexTileType.RiverH, // 4 river edges
        // HexTileType.RiverI, // 4 river edges
        // HexTileType.RiverJ, // 4 river edges
        // HexTileType.RiverK, // 5 river edges
        // HexTileType.RiverL, // 6 river edges
];

const NeighborDirections: IHexCoord[] = [
    { q: 1, r: 0 },   // 0°
    { q: 1, r: -1 },  // 60°
    { q: 0, r: -1 },  // 120°
    { q: -1, r: 0 },  // 180°
    { q: -1, r: 1 },  // 240°
    { q: 0, r: 1 },   // 300°
];

const DefaultWFCConfig: IWFCConfig = {
    radius: GameConfig.gameField.radius.default,
    hexTileTypesUsed: WFCTiles,
    predefinedTiles: [
        // {
        //     coord: { q: 0, r: 0 },
        //     type: HexTileType.RoadA,
        //     rotation: HexRotation.Rotate0
        // },
        // {
        //     coord: { q: -4, r: 0 },
        //     type: HexTileType.Water,
        //     rotation: HexRotation.Rotate0
        // },
        // {
        //     coord: { q: 0, r: 0 },
        //     type: HexTileType.RiverA,
        //     rotation: HexRotation.Rotate0
        // },
    ]
};

export { NeighborDirections, WFCTiles, DefaultWFCConfig };
