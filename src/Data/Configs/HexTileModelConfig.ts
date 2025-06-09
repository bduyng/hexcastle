import { HexTileType } from "../Enums/HexTileType";
import { IHexTileModelConfig } from "../Interfaces/IHexTile";

const HexTileModelConfig: { [key in HexTileType]: IHexTileModelConfig } = {
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
};

export default HexTileModelConfig;
