import { HexTileType } from "../Enums/HexTileType";
import { IBuildingConfig } from "../Interfaces/ICity";

const AvailableWallTileTypes: HexTileType[][] = [
    [
        HexTileType.ArcheryRangeBlue,
        HexTileType.BarracksBlue,
        HexTileType.ChurchBlue,
        HexTileType.HomeBBlue,
        HexTileType.MarketBlue,
        HexTileType.TavernBlue,
        HexTileType.WellBlue,
        HexTileType.WindmillBlue
    ],
    [
        HexTileType.ArcheryRangeRed,
        HexTileType.BarracksRed,
        HexTileType.ChurchRed,
        HexTileType.HomeBRed,
        HexTileType.MarketRed,
        HexTileType.TavernRed,
        HexTileType.WellRed,
        HexTileType.WindmillRed
    ]
];

const BuildingConfig: { [key in HexTileType]?: IBuildingConfig } = {
    // Blue buildings
    [HexTileType.ChurchBlue]: {
        weight: 0.8,
        maxCount: 1
    },
    [HexTileType.WellBlue]: {
        weight: 0.6,
        maxCount: 1
    },
    [HexTileType.WindmillBlue]: {
        weight: 0.7,
        maxCount: 1
    },
    [HexTileType.MarketBlue]: {
        weight: 1.2,
        maxCount: 2
    },
    [HexTileType.HomeBBlue]: {
        weight: 1.5
    },
    [HexTileType.TavernBlue]: {
        weight: 1.1,
        maxCount: 3
    },
    [HexTileType.BarracksBlue]: {
        weight: 0.9,
        maxCount: 2
    },
    [HexTileType.ArcheryRangeBlue]: {
        weight: 0.9,
        maxCount: 1
    },
    [HexTileType.ChurchRed]: {
        weight: 0.8,
        maxCount: 1
    },

    // Red buildings
    [HexTileType.WellRed]: {
        weight: 0.6,
        maxCount: 1
    },
    [HexTileType.WindmillRed]: {
        weight: 0.7,
        maxCount: 1
    },
    [HexTileType.MarketRed]: {
        weight: 1.2,
        maxCount: 2
    },
    [HexTileType.HomeBRed]: {
        weight: 1.5
    },
    [HexTileType.TavernRed]: {
        weight: 1.1,
        maxCount: 3
    },
    [HexTileType.BarracksRed]: {
        weight: 0.9,
        maxCount: 2
    },
    [HexTileType.ArcheryRangeRed]: {
        weight: 0.9,
        maxCount: 1
    }
}

export { AvailableWallTileTypes, BuildingConfig };
