import { EdgeType } from "../Enums/EdgeType";
import { GroundCellType } from "../Enums/GroundCellType";
import { ICellRules } from "../Interfaces/IBaseSceneData";

const CellRulesConfig: ICellRules[] = [
    {
        type: GroundCellType.Grass,
        edges: [
            EdgeType.Grass, // 0
            EdgeType.Grass, // 60
            EdgeType.Grass, // 120
            EdgeType.Grass, // 180
            EdgeType.Grass, // 240
            EdgeType.Grass, // 300
        ],
        weight: 1,
    },
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
        weight: 3,
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
        weight: 2,
    },
];

export { CellRulesConfig };
