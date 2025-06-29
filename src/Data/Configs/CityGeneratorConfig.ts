import { HexTileType } from "../Enums/HexTileType";
import { IBuildingConfig } from "../Interfaces/ICity";

const AvailableWallTileTypes: HexTileType[] = [
    HexTileType.ArcheryRange,
    HexTileType.Barracks,
    HexTileType.Church,
    HexTileType.HomeB,
    HexTileType.Market,
    HexTileType.Tavern,
    HexTileType.Well,
    HexTileType.Windmill
];

const BuildingConfig: { [key in HexTileType]?: IBuildingConfig } = {
    [HexTileType.Church]: {
        weight: 0.8,
        maxCount: 1
    },
    [HexTileType.Well]: {
        weight: 0.6,
        maxCount: 1
    },
    [HexTileType.Windmill]: {
        weight: 0.7,
        maxCount: 1
    },
    [HexTileType.Market]: {
        weight: 1.2,
        maxCount: 2
    },
    [HexTileType.HomeB]: {
        weight: 1.5
    },
    [HexTileType.Tavern]: {
        weight: 1.1,
        maxCount: 3
    },
    [HexTileType.Barracks]: {
        weight: 0.9,
        maxCount: 2
    },
    [HexTileType.ArcheryRange]: {
        weight: 0.9,
        maxCount: 1
    },
}

export { AvailableWallTileTypes, BuildingConfig };
