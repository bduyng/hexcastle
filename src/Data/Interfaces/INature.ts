import { HexTileType } from "../Enums/HexTileType";

export interface INatureTileConfig {
    type?: HexTileType;
    weight: number;
}

export interface INatureClusterConfig {
    fillPercentage: number;
    clusterChance: number;
    maxClusterSize: number;
}