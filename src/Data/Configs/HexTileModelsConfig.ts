import { HexTileType } from "../Enums/HexTileType";
import { IHexTileModelConfig } from "../Interfaces/IHexTile";

const HexTileModelsConfig: { [key in HexTileType]: IHexTileModelConfig } = {
    [HexTileType.Grass]: {
        modelName: 'hex_grass',
    },
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
    [HexTileType.RoadM]: {
        modelName: 'hex_road_M',
    },
};

export default HexTileModelsConfig;
