import { HexTileType } from "../Enums/HexTileType";
import { INatureTileConfig } from "../Interfaces/INature";

const NatureConfig: { [key in HexTileType]?: INatureTileConfig } = {
    [HexTileType.TreesALarge]: {
        type: HexTileType.TreesALarge,
        weight: 1.0
    },
    [HexTileType.TreesAMedium]: {
        type: HexTileType.TreesAMedium,
        weight: 1.2
    },
    [HexTileType.MountainA]: {
        type: HexTileType.MountainA,
        weight: 1.0
    },
    [HexTileType.MountainB]: {
        type: HexTileType.MountainB,
        weight: 1.1
    },
    [HexTileType.MountainC]: {
        type: HexTileType.MountainC,
        weight: 0.9
    },
    [HexTileType.HillsA]: {
        type: HexTileType.HillsA,
        weight: 1.0
    },
    [HexTileType.HillsATrees]: {
        type: HexTileType.HillsATrees,
        weight: 1.1
    },
    [HexTileType.HillsB]: {
        type: HexTileType.HillsB,
        weight: 1.0
    },
    [HexTileType.HillsBTrees]: {
        type: HexTileType.HillsBTrees,
        weight: 1.1
    },
    [HexTileType.HillsC]: {
        type: HexTileType.HillsC,
        weight: 0.9
    }
};

const TreesTiles: HexTileType[] = [
    HexTileType.TreesALarge,
    HexTileType.TreesAMedium,
];

const RocksTiles: HexTileType[] = [
    HexTileType.MountainA,
    HexTileType.MountainB,
    HexTileType.MountainC,
];

const SingleTiles: HexTileType[] = [
    HexTileType.HillsA,
    HexTileType.HillsATrees,
    HexTileType.HillsB,
    HexTileType.HillsBTrees,
    HexTileType.HillsC,
];

export { NatureConfig, TreesTiles, RocksTiles, SingleTiles };
