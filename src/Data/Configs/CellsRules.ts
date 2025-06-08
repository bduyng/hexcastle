import { EdgeType } from "../Enums/EdgeType";
import { GroundCellType } from "../Enums/GroundCellType";
import { ICellRules } from "../Interfaces/IBaseSceneData";

const CellRulesConfig: ICellRules[] = [
    // {
    //     type: GroundCellType.Grass,
    //     edges: [
    //         EdgeType.Grass, // 0
    //         EdgeType.Grass, // 60
    //         EdgeType.Grass, // 120
    //         EdgeType.Grass, // 180
    //         EdgeType.Grass, // 240
    //         EdgeType.Grass, // 300
    //     ],
    //     weight: 1,
    // },
    {
        type: GroundCellType.RoadA,
        edges: [
            EdgeType.Road, // 0
            EdgeType.Grass, // 60
            EdgeType.Grass, // 120
            EdgeType.Road, // 180
            EdgeType.Grass, // 240
            EdgeType.Grass, // 300
        ],
        weight: 1,
    },
    {
        type: GroundCellType.RoadB,
        edges: [
            EdgeType.Road, // 0
            EdgeType.Grass, // 60
            EdgeType.Grass, // 120
            EdgeType.Grass, // 180
            EdgeType.Road, // 240
            EdgeType.Grass, // 300
        ],
        weight: 1,
    },
    {
        type: GroundCellType.RoadC,
        edges: [
            EdgeType.Road, // 0
            EdgeType.Grass, // 60
            EdgeType.Grass, // 120
            EdgeType.Grass, // 180
            EdgeType.Grass, // 240
            EdgeType.Road, // 300
        ],
        weight: 1,
    },
    {
        type: GroundCellType.RoadD,
        edges: [
            EdgeType.Road, // 0
            EdgeType.Grass, // 60
            EdgeType.Road, // 120
            EdgeType.Grass, // 180
            EdgeType.Road, // 240
            EdgeType.Grass, // 300
        ],
        weight: 1,
    },
    {
        type: GroundCellType.RoadE,
        edges: [
            EdgeType.Road, // 0
            EdgeType.Grass, // 60
            EdgeType.Grass, // 120
            EdgeType.Road, // 180
            EdgeType.Road, // 240
            EdgeType.Grass, // 300
        ],
        weight: 1,
    },
    {
        type: GroundCellType.RoadF,
        edges: [
            EdgeType.Road, // 0
            EdgeType.Grass, // 60
            EdgeType.Road, // 120
            EdgeType.Road, // 180
            EdgeType.Grass, // 240
            EdgeType.Grass, // 300
        ],
        weight: 1,
    },
    {
        type: GroundCellType.RoadM,
        edges: [
            EdgeType.Road, // 0
            EdgeType.Grass, // 60
            EdgeType.Grass, // 120
            EdgeType.Grass, // 180
            EdgeType.Grass, // 240
            EdgeType.Grass, // 300
        ],
        weight: 1,
    },
];

export { CellRulesConfig };
