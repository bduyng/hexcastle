import { HexTileType } from "../Enums/HexTileType";
import { ITileShadowConfig } from "../Interfaces/IHexTile";

const TilesShadowConfig: { [key in HexTileType]: ITileShadowConfig } = {
    // Base tiles
    [HexTileType.Grass]: {
        castShadow: false,
        receiveShadow: true,
    },
    [HexTileType.Water]: {
        castShadow: false,
        receiveShadow: true,
    },

    // Roads
    [HexTileType.RoadA]: {
        castShadow: false,
        receiveShadow: true,
    },
    [HexTileType.RoadB]: {
        castShadow: false,
        receiveShadow: true,
    },
    [HexTileType.RoadC]: {
        castShadow: false,
        receiveShadow: true,
    },
    [HexTileType.RoadD]: {
        castShadow: false,
        receiveShadow: true,
    },
    [HexTileType.RoadE]: {
        castShadow: false,
        receiveShadow: true,
    },
    [HexTileType.RoadF]: {
        castShadow: false,
        receiveShadow: true,
    },
    [HexTileType.RoadG]: {
        castShadow: false,
        receiveShadow: true,
    },
    [HexTileType.RoadH]: {
        castShadow: false,
        receiveShadow: true,
    },
    [HexTileType.RoadI]: {
        castShadow: false,
        receiveShadow: true,
    },
    [HexTileType.RoadJ]: {
        castShadow: false,
        receiveShadow: true,
    },
    [HexTileType.RoadK]: {
        castShadow: false,
        receiveShadow: true,
    },
    [HexTileType.RoadL]: {
        castShadow: false,
        receiveShadow: true,
    },
    [HexTileType.RoadM]: {
        castShadow: false,
        receiveShadow: true,
    },

    // Coast
    [HexTileType.CoastA]: {
        castShadow: false,
        receiveShadow: true,
    },
    [HexTileType.CoastB]: {
        castShadow: false,
        receiveShadow: true,
    },
    [HexTileType.CoastC]: {
        castShadow: false,
        receiveShadow: true,
    },
    [HexTileType.CoastD]: {
        castShadow: false,
        receiveShadow: true,
    },
    [HexTileType.CoastE]: {
        castShadow: false,
        receiveShadow: true,
    },

    // Rivers
    [HexTileType.RiverA]: {
        castShadow: false,
        receiveShadow: true,
    },
    [HexTileType.RiverACurvy]: {
        castShadow: false,
        receiveShadow: true,
    },
    [HexTileType.RiverB]: {
        castShadow: false,
        receiveShadow: true,
    },
    [HexTileType.RiverC]: {
        castShadow: false,
        receiveShadow: true,
    },
    [HexTileType.RiverCrossingA]: {
        castShadow: false,
        receiveShadow: true,
    },
    [HexTileType.RiverCrossingB]: {
        castShadow: false,
        receiveShadow: true,
    },
    [HexTileType.RiverD]: {
        castShadow: false,
        receiveShadow: true,
    },
    [HexTileType.RiverE]: {
        castShadow: false,
        receiveShadow: true,
    },
    [HexTileType.RiverF]: {
        castShadow: false,
        receiveShadow: true,
    },
    [HexTileType.RiverG]: {
        castShadow: false,
        receiveShadow: true,
    },
    [HexTileType.RiverH]: {
        castShadow: false,
        receiveShadow: true,
    },
    [HexTileType.RiverI]: {
        castShadow: false,
        receiveShadow: true,
    },
    [HexTileType.RiverJ]: {
        castShadow: false,
        receiveShadow: true,
    },
    [HexTileType.RiverK]: {
        castShadow: false,
        receiveShadow: true,
    },
    [HexTileType.RiverL]: {
        castShadow: false,
        receiveShadow: true,
    },

    // Walls
    [HexTileType.WallCornerAGate]: {
        castShadow: true,
        receiveShadow: true,
    },
    [HexTileType.WallCornerAInside]: {
        castShadow: true,
        receiveShadow: true,
    },
    [HexTileType.WallCornerAOutside]: {
        castShadow: true,
        receiveShadow: true,
    },
    [HexTileType.WallCornerBInside]: {
        castShadow: true,
        receiveShadow: true,
    },
    [HexTileType.WallCornerBOutside]: {
        castShadow: true,
        receiveShadow: true,
    },
    [HexTileType.WallStraight]: {
        castShadow: true,
        receiveShadow: true,
    },
    [HexTileType.WallStraightGate]: {
        castShadow: true,
        receiveShadow: true,
    },

    // Nature
    [HexTileType.HillsA]: {
        castShadow: true,
        receiveShadow: true,
    },
    [HexTileType.HillsATrees]: {
        castShadow: true,
        receiveShadow: true,
    },
    [HexTileType.HillsB]: {
        castShadow: true,
        receiveShadow: true,
    },
    [HexTileType.HillsBTrees]: {
        castShadow: true,
        receiveShadow: true,
    },
    [HexTileType.HillsC]: {
        castShadow: true,
        receiveShadow: true,
    },
    [HexTileType.MountainA]: {
        castShadow: true,
        receiveShadow: true,
    },
    [HexTileType.MountainB]: {
        castShadow: true,
        receiveShadow: true,
    },
    [HexTileType.MountainC]: {
        castShadow: true,
        receiveShadow: true,
    },
    [HexTileType.TreesALarge]: {
        castShadow: true,
        receiveShadow: true,
    },
    [HexTileType.TreesAMedium]: {
        castShadow: true,
        receiveShadow: true,
    },

    // City
    // Blue buildings
    [HexTileType.CastleBlue]: {
        castShadow: true,
        receiveShadow: true,
    },
    [HexTileType.ArcheryRangeBlue]: {
        castShadow: true,
        receiveShadow: true,
    },
    [HexTileType.BarracksBlue]: {
        castShadow: true,
        receiveShadow: true,
    },
    [HexTileType.ChurchBlue]: {
        castShadow: true,
        receiveShadow: true,
    },
    [HexTileType.HomeBBlue]: {
        castShadow: true,
        receiveShadow: true,
    },
    [HexTileType.MarketBlue]: {
        castShadow: true,
        receiveShadow: true,
    },
    [HexTileType.TavernBlue]: {
        castShadow: true,
        receiveShadow: true,
    },
    [HexTileType.WellBlue]: {
        castShadow: true,
        receiveShadow: true,
    },
    [HexTileType.WindmillBlue]: {
        castShadow: true,
        receiveShadow: true,
    },

    // Red buildings
    [HexTileType.CastleRed]: {
        castShadow: true,
        receiveShadow: true,
    },
    [HexTileType.ArcheryRangeRed]: {
        castShadow: true,
        receiveShadow: true,
    },
    [HexTileType.BarracksRed]: {
        castShadow: true,
        receiveShadow: true,
    },
    [HexTileType.ChurchRed]: {
        castShadow: true,
        receiveShadow: true,
    },
    [HexTileType.HomeBRed]: {
        castShadow: true,
        receiveShadow: true,
    },
    [HexTileType.MarketRed]: {
        castShadow: true,
        receiveShadow: true,
    },
    [HexTileType.TavernRed]: {
        castShadow: true,
        receiveShadow: true,
    },
    [HexTileType.WellRed]: {
        castShadow: true,
        receiveShadow: true,
    },
    [HexTileType.WindmillRed]: {
        castShadow: true,
        receiveShadow: true,
    },

}

export { TilesShadowConfig };
