import { HexTileType } from "../../../../Data/Enums/HexTileType";
import { IHexCoord } from "../../../../Data/Interfaces/IHexTile";
import { IHexTilesResult, INewTileStep } from "../../../../Data/Interfaces/IWFC";

export class NatureGenerator {
    private hexTilesResults: IHexTilesResult[] = [];
    private newTileSteps: INewTileStep[] = [];

    constructor() {

    }

    public generate(tiles: IHexCoord[]): void {
        this.reset();

        const treesTiles: HexTileType[] = [
            HexTileType.TreesALarge,
            HexTileType.TreesAMedium,
        ];

        const mountainsTiles: HexTileType[] = [
            HexTileType.MountainA,
            HexTileType.MountainB,
            HexTileType.MountainC,
        ];

        const singleTiles: HexTileType[] = [
            HexTileType.HillsA,
            HexTileType.HillsATrees,
            HexTileType.HillsB,
            HexTileType.HillsBTrees,
            HexTileType.HillsC,
        ];
        
    }

    public reset(): void {
        this.hexTilesResults = [];
        this.newTileSteps = [];
    }

    public getSteps(): INewTileStep[] {
        return this.newTileSteps;
    }

    public getTiles(): IHexTilesResult[] {
        return this.hexTilesResults;
    }
} 