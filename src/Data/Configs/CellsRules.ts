import { EdgeType } from "../Enums/EdgeType";
import { GroundCellType } from "../Enums/GroundCellType";
import { ICellRules } from "../Interfaces/IBaseSceneData";

const CellRulesConfig: ICellRules[] = [
    // {
    //     type: GroundCellType.Grass,
    //     edges: [
    //         EdgeType.Grass,
    //         EdgeType.Grass,
    //         EdgeType.Grass,
    //         EdgeType.Grass,
    //         EdgeType.Grass,
    //         EdgeType.Grass,
    //     ],
    //     weight: 1,
    // },
    {
        type: GroundCellType.RoadA,
        edges: [ // 0 - 60 - 120 - 180 - 240 - 300
            EdgeType.Road,
            EdgeType.Grass,
            EdgeType.Grass,
            EdgeType.Road,
            EdgeType.Grass,
            EdgeType.Grass,
        ],
        weight: 1,
    },
    {
        type: GroundCellType.RoadB,
        edges: [
            EdgeType.Road,
            EdgeType.Grass,
            EdgeType.Grass,
            EdgeType.Grass,
            EdgeType.Road,
            EdgeType.Grass,
        ],
        weight: 1,
    },
    {
        type: GroundCellType.RoadC,
        edges: [
            EdgeType.Road,
            EdgeType.Grass,
            EdgeType.Grass,
            EdgeType.Grass,
            EdgeType.Grass,
            EdgeType.Road,
        ],
        weight: 1,
    },
    {
        type: GroundCellType.RoadD,
        edges: [
            EdgeType.Road,
            EdgeType.Grass,
            EdgeType.Road,
            EdgeType.Grass,
            EdgeType.Road,
            EdgeType.Grass,
        ],
        weight: 1,
    },
    {
        type: GroundCellType.RoadE,
        edges: [
            EdgeType.Road,
            EdgeType.Grass,
            EdgeType.Grass,
            EdgeType.Road,
            EdgeType.Road,
            EdgeType.Grass,
        ],
        weight: 1,
    },
    {
        type: GroundCellType.RoadF,
        edges: [
            EdgeType.Road,
            EdgeType.Grass,
            EdgeType.Road,
            EdgeType.Road,
            EdgeType.Grass,
            EdgeType.Grass,
        ],
        weight: 1,
    },
    {
        type: GroundCellType.RoadM,
        edges: [
            EdgeType.Road,
            EdgeType.Grass,
            EdgeType.Grass,
            EdgeType.Grass,
            EdgeType.Grass,
            EdgeType.Grass,
        ],
        weight: 1,
    },
];

export { CellRulesConfig };
