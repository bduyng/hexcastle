import { HexTileType } from "../Enums/HexTileType";
import { ITileShadowConfig } from "../Interfaces/IHexTile";

const TilesShadowConfig: { [key in HexTileType]: ITileShadowConfig } = {
    // Base tiles
    [HexTileType.Grass]: {
        castShadow: false,
        receiveShadow: true,
        needUpdate: false,
    },
    [HexTileType.Water]: {
        castShadow: false,
        receiveShadow: true,
        needUpdate: false,
    },

    // Roads
    [HexTileType.RoadA]: {
        castShadow: false,
        receiveShadow: true,
        needUpdate: false,
    },
    [HexTileType.RoadB]: {
        castShadow: false,
        receiveShadow: true,
        needUpdate: false,
    },
    [HexTileType.RoadC]: {
        castShadow: false,
        receiveShadow: true,
        needUpdate: false,
    },
    [HexTileType.RoadD]: {
        castShadow: false,
        receiveShadow: true,
        needUpdate: false,
    },
    [HexTileType.RoadE]: {
        castShadow: false,
        receiveShadow: true,
        needUpdate: false,
    },
    [HexTileType.RoadF]: {
        castShadow: false,
        receiveShadow: true,
        needUpdate: false,
    },
    [HexTileType.RoadG]: {
        castShadow: false,
        receiveShadow: true,
        needUpdate: false,
    },
    [HexTileType.RoadH]: {
        castShadow: false,
        receiveShadow: true,
        needUpdate: false,
    },
    [HexTileType.RoadI]: {
        castShadow: false,
        receiveShadow: true,
        needUpdate: false,
    },
    [HexTileType.RoadJ]: {
        castShadow: false,
        receiveShadow: true,
        needUpdate: false,
    },
    [HexTileType.RoadK]: {
        castShadow: false,
        receiveShadow: true,
        needUpdate: false,
    },
    [HexTileType.RoadL]: {
        castShadow: false,
        receiveShadow: true,
        needUpdate: false,
    },
    [HexTileType.RoadM]: {
        castShadow: false,
        receiveShadow: true,
        needUpdate: false,
    },

    // Coast
    [HexTileType.CoastA]: {
        castShadow: false,
        receiveShadow: true,
        needUpdate: false,
    },
    [HexTileType.CoastB]: {
        castShadow: false,
        receiveShadow: true,
        needUpdate: false,
    },
    [HexTileType.CoastC]: {
        castShadow: false,
        receiveShadow: true,
        needUpdate: false,
    },
    [HexTileType.CoastD]: {
        castShadow: false,
        receiveShadow: true,
        needUpdate: false,
    },
    [HexTileType.CoastE]: {
        castShadow: false,
        receiveShadow: true,
        needUpdate: false,
    },

    // Rivers
    [HexTileType.RiverA]: {
        castShadow: false,
        receiveShadow: true,
        needUpdate: false,
    },
    [HexTileType.RiverACurvy]: {
        castShadow: false,
        receiveShadow: true,
        needUpdate: false,
    },
    [HexTileType.RiverB]: {
        castShadow: false,
        receiveShadow: true,
        needUpdate: false,
    },
    [HexTileType.RiverC]: {
        castShadow: false,
        receiveShadow: true,
        needUpdate: false,
    },
    [HexTileType.RiverCrossingA]: {
        castShadow: false,
        receiveShadow: true,
        needUpdate: false,
    },
    [HexTileType.RiverCrossingB]: {
        castShadow: false,
        receiveShadow: true,
        needUpdate: false,
    },
    [HexTileType.RiverD]: {
        castShadow: false,
        receiveShadow: true,
        needUpdate: false,
    },
    [HexTileType.RiverE]: {
        castShadow: false,
        receiveShadow: true,
        needUpdate: false,
    },
    [HexTileType.RiverF]: {
        castShadow: false,
        receiveShadow: true,
        needUpdate: false,
    },
    [HexTileType.RiverG]: {
        castShadow: false,
        receiveShadow: true,
        needUpdate: false,
    },
    [HexTileType.RiverH]: {
        castShadow: false,
        receiveShadow: true,
        needUpdate: false,
    },
    [HexTileType.RiverI]: {
        castShadow: false,
        receiveShadow: true,
        needUpdate: false,
    },
    [HexTileType.RiverJ]: {
        castShadow: false,
        receiveShadow: true,
        needUpdate: false,
    },
    [HexTileType.RiverK]: {
        castShadow: false,
        receiveShadow: true,
        needUpdate: false,
    },
    [HexTileType.RiverL]: {
        castShadow: false,
        receiveShadow: true,
        needUpdate: false,
    },

    // Walls
    [HexTileType.WallCornerAGate]: {
        castShadow: true,
        receiveShadow: true,
        needUpdate: true,
    },
    [HexTileType.WallCornerAInside]: {
        castShadow: true,
        receiveShadow: true,
        needUpdate: true,
    },
    [HexTileType.WallCornerAOutside]: {
        castShadow: true,
        receiveShadow: true,
        needUpdate: true,
    },
    [HexTileType.WallCornerBInside]: {
        castShadow: true,
        receiveShadow: true,
        needUpdate: true,
    },
    [HexTileType.WallCornerBOutside]: {
        castShadow: true,
        receiveShadow: true,
        needUpdate: true,
    },
    [HexTileType.WallStraight]: {
        castShadow: true,
        receiveShadow: true,
        needUpdate: true,
    },
    [HexTileType.WallStraightGate]: {
        castShadow: true,
        receiveShadow: true,
        needUpdate: true,
    },

    // Nature
    [HexTileType.MountainA]: {
        castShadow: true,
        receiveShadow: true,
        needUpdate: true,
    },

    // City
    [HexTileType.Castle]: {
        castShadow: true,
        receiveShadow: true,
        needUpdate: true,
    },
    [HexTileType.ArcheryRange]: {
        castShadow: true,
        receiveShadow: true,
        needUpdate: true,
    },
    [HexTileType.Barracks]: {
        castShadow: true,
        receiveShadow: true,
        needUpdate: true,
    },
    [HexTileType.Blacksmith]: {
        castShadow: true,
        receiveShadow: true,
        needUpdate: true,
    },
    [HexTileType.Church]: {
        castShadow: true,
        receiveShadow: true,
        needUpdate: true,
    },
    [HexTileType.HomeA]: {
        castShadow: true,
        receiveShadow: true,
        needUpdate: true,
    },
    [HexTileType.HomeB]: {
        castShadow: true,
        receiveShadow: true,
        needUpdate: true,
    },
    [HexTileType.Market]: {
        castShadow: true,
        receiveShadow: true,
        needUpdate: true,
    },
    [HexTileType.Tavern]: {
        castShadow: true,
        receiveShadow: true,
        needUpdate: true,
    },
    [HexTileType.Well]: {
        castShadow: true,
        receiveShadow: true,
        needUpdate: true,
    },
    [HexTileType.Windmill]: {
        castShadow: true,
        receiveShadow: true,
        needUpdate: true,
    },

}

export { TilesShadowConfig };
