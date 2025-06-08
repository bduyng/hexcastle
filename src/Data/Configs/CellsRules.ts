import { GroundCellType } from "../Enums/GroundCellType";

const CellsRules = {
    // [GroundCellType.Grass]: [GroundCellType.Grass, GroundCellType.Sand, GroundCellType.Water],
    // [GroundCellType.Water]: [GroundCellType.Water, GroundCellType.Grass],
    // [GroundCellType.Sand]: [GroundCellType.Sand, GroundCellType.Grass],
};

const CellsWeights = {
    [GroundCellType.Grass]: 1,
    [GroundCellType.RoadA]: 1,
    [GroundCellType.RoadB]: 1,
    [GroundCellType.RoadM]: 1,
};

export enum EdgeType {
    None = 'NONE',
    Road = 'ROAD',
    River = 'RIVER',
}

interface BaseTileDefinition {
    type: GroundCellType;
    edges: EdgeType[]; // [s0, s1, s2, s3, s4, s5]
    weight: number;
}

const baseTileDefinitions: BaseTileDefinition[] = [
    {
        type: GroundCellType.Grass,
        edges: [EdgeType.None, EdgeType.None, EdgeType.None, EdgeType.None, EdgeType.None, EdgeType.None],
        weight: 1,
    },
    {
        type: GroundCellType.RoadA,
        edges: [EdgeType.Road, EdgeType.None, EdgeType.None, EdgeType.Road, EdgeType.None, EdgeType.None],
        weight: 2,
    },
    {
        type: GroundCellType.RoadB,
        edges: [EdgeType.Road, EdgeType.None, EdgeType.None, EdgeType.Road, EdgeType.None, EdgeType.None],
        weight: 2,
    },
    {
        type: GroundCellType.RoadC,
        edges: [EdgeType.None, EdgeType.None, EdgeType.Road, EdgeType.Road, EdgeType.None, EdgeType.None],
        weight: 2,
    },
    {
        type: GroundCellType.RoadD,
        edges: [EdgeType.None, EdgeType.Road, EdgeType.None, EdgeType.Road, EdgeType.None, EdgeType.Road],
        weight: 2,
    },
    {
        type: GroundCellType.RoadM,
        edges: [EdgeType.Road, EdgeType.None, EdgeType.None, EdgeType.None, EdgeType.None, EdgeType.None],
        weight: 2,
    },
];

export { CellsRules, CellsWeights, baseTileDefinitions };
