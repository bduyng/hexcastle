import { HexTileType } from "../Enums/HexTileType";
import { IHexTileModelConfig } from "../Interfaces/IHexTile";

const HexTileModelConfig: { [key in HexTileType]: IHexTileModelConfig } = {
    // base
    [HexTileType.Grass]: {
        modelName: 'hex_grass',
    },
    [HexTileType.Water]: {
        modelName: 'hex_water',
    },
    [HexTileType.Error]: {
        modelName: 'hex_error',
    },

    // roads
    [HexTileType.RoadA]: {
        modelName: 'hex_road_A',
    },
    [HexTileType.RoadB]: {
        modelName: 'hex_road_B',
    },
    [HexTileType.RoadC]: {
        modelName: 'hex_road_C',
    },
    [HexTileType.RoadD]: {
        modelName: 'hex_road_D',
    },
    [HexTileType.RoadE]: {
        modelName: 'hex_road_E',
    },
    [HexTileType.RoadF]: {
        modelName: 'hex_road_F',
    },
    [HexTileType.RoadG]: {
        modelName: 'hex_road_G',
    },
    [HexTileType.RoadH]: {
        modelName: 'hex_road_H',
    },
    [HexTileType.RoadI]: {
        modelName: 'hex_road_I',
    },
    [HexTileType.RoadJ]: {
        modelName: 'hex_road_J',
    },
    [HexTileType.RoadK]: {
        modelName: 'hex_road_K',
    },
    [HexTileType.RoadL]: {
        modelName: 'hex_road_L',
    },
    [HexTileType.RoadM]: {
        modelName: 'hex_road_M',
    },

    // coast
    [HexTileType.CoastA]: {
        modelName: 'hex_coast_A',
    },
    [HexTileType.CoastB]: {
        modelName: 'hex_coast_B',
    },
    [HexTileType.CoastC]: {
        modelName: 'hex_coast_C',
    },
    [HexTileType.CoastD]: {
        modelName: 'hex_coast_D',
    },
    [HexTileType.CoastE]: {
        modelName: 'hex_coast_E',
    },

    // rivers
    [HexTileType.RiverA]: {
        modelName: 'hex_river_A',
    },
    [HexTileType.RiverACurvy]: {
        modelName: 'hex_river_A_curvy',
    },
    [HexTileType.RiverB]: {
        modelName: 'hex_river_B',
    },
    [HexTileType.RiverC]: {
        modelName: 'hex_river_C',
    },
    [HexTileType.RiverCrossingA]: {
        modelName: 'hex_river_crossing_A',
    },
    [HexTileType.RiverCrossingB]: {
        modelName: 'hex_river_crossing_B',
    },
    [HexTileType.RiverD]: {
        modelName: 'hex_river_D',
    },
    [HexTileType.RiverE]: {
        modelName: 'hex_river_E',
    },
    [HexTileType.RiverF]: {
        modelName: 'hex_river_F',
    },
    [HexTileType.RiverG]: {
        modelName: 'hex_river_G',
    },
    [HexTileType.RiverH]: {
        modelName: 'hex_river_H',
    },
    [HexTileType.RiverI]: {
        modelName: 'hex_river_I',
    },
    [HexTileType.RiverJ]: {
        modelName: 'hex_river_J',
    },
    [HexTileType.RiverK]: {
        modelName: 'hex_river_K',
    },
    [HexTileType.RiverL]: {
        modelName: 'hex_river_L',
    },

    // walls
    [HexTileType.WallCornerAGate]: {
        modelName: 'wall_corner_A_gate',
    },  
    [HexTileType.WallCornerAInside]: {
        modelName: 'wall_corner_A_inside',
    },
    [HexTileType.WallCornerAOutside]: {
        modelName: 'wall_corner_A_outside',
    },
    [HexTileType.WallCornerBInside]: {
        modelName: 'wall_corner_B_inside',
    },
    [HexTileType.WallCornerBOutside]: {
        modelName: 'wall_corner_B_outside',
    },
    [HexTileType.WallStraight]: {
        modelName: 'wall_straight',
    },
    [HexTileType.WallStraightGate]: {
        modelName: 'wall_straight_gate',
    },

    // nature
    [HexTileType.HillsA]: {
        modelName: 'hills_A',
    },
    [HexTileType.HillsATrees]: {
        modelName: 'hills_A_trees',
    },
    [HexTileType.HillsB]: {
        modelName: 'hills_B',
    },
    [HexTileType.HillsBTrees]: {
        modelName: 'hills_B_trees',
    },
    [HexTileType.HillsC]: {
        modelName: 'hills_C',
    },
    [HexTileType.MountainA]: {
        modelName: 'mountain_A',
    },
    [HexTileType.MountainB]: {
        modelName: 'mountain_B',
    },
    [HexTileType.MountainC]: {
        modelName: 'mountain_C',
    },
    [HexTileType.TreesALarge]: {
        modelName: 'trees_A_large',
    },
    [HexTileType.TreesAMedium]: {
        modelName: 'trees_A_medium',
    },

    // buildings
    [HexTileType.CastleBlue]: {
        modelName: 'building_castle_blue_no_flag',
    },
    [HexTileType.ArcheryRangeBlue]: {
        modelName: 'building_archeryrange_blue',
    },
    [HexTileType.BarracksBlue]: {
        modelName: 'building_barracks_blue',
    },
    [HexTileType.ChurchBlue]: {
        modelName: 'building_church_blue',
    },
    [HexTileType.HomeBBlue]: {
        modelName: 'building_home_B_blue',
    },
    [HexTileType.MarketBlue]: {
        modelName: 'building_market_blue',
    },
    [HexTileType.TavernBlue]: {
        modelName: 'building_tavern_blue',
    },
    [HexTileType.WellBlue]: {
        modelName: 'building_well_blue',
    },
    [HexTileType.WindmillBlue]: {
        modelName: 'building_windmill_blue',
    },
    [HexTileType.CastleRed]: {
        modelName: 'building_castle_red',
    },
    [HexTileType.ArcheryRangeRed]: {
        modelName: 'building_archeryrange_red',
    },
    [HexTileType.BarracksRed]: {
        modelName: 'building_barracks_red',
    },
    [HexTileType.ChurchRed]: {
        modelName: 'building_church_red',
    },
    [HexTileType.HomeBRed]: {
        modelName: 'building_home_B_red',
    },
    [HexTileType.MarketRed]: {
        modelName: 'building_market_red',
    },
    [HexTileType.TavernRed]: {
        modelName: 'building_tavern_red',
    },
    [HexTileType.WellRed]: {
        modelName: 'building_well_red',
    },
    [HexTileType.WindmillRed]: {
        modelName: 'building_windmill_red',
    },
};

export default HexTileModelConfig;
