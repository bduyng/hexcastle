import { GroundCellType } from "../Enums/GroundCellType";
import { IGroundCellConfig } from "../Interfaces/ICell";

const GroundCellConfig: { [key in GroundCellType]: IGroundCellConfig } = {
    [GroundCellType.Grass]: {
        modelName: 'hex_grass',
    },
    [GroundCellType.RoadA]: {
        modelName: 'hex_road_A',
    },
    [GroundCellType.RoadB]: {
        modelName: 'hex_road_B',
    },
    [GroundCellType.RoadC]: {
        modelName: 'hex_road_C',
    },
    [GroundCellType.RoadD]: {
        modelName: 'hex_road_D',
    },
    [GroundCellType.RoadE]: {
        modelName: 'hex_road_E',
    },
    [GroundCellType.RoadF]: {
        modelName: 'hex_road_F',
    },
    [GroundCellType.RoadM]: {
        modelName: 'hex_road_M',
    },
};

export default GroundCellConfig;
