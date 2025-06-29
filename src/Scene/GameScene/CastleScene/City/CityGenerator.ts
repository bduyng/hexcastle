import { HexRotation } from "../../../../Data/Enums/HexRotation";
import { HexTileType } from "../../../../Data/Enums/HexTileType";
import { IHexCoord } from "../../../../Data/Interfaces/IHexTile";
import { IWallCityConfig } from "../../../../Data/Interfaces/IWall";
import { IHexTilesResult, INewTileStep } from "../../../../Data/Interfaces/IWFC";
import ThreeJSHelper from "../../../../Helpers/ThreeJSHelper";

export class CityGenerator {
    private hexTilesResults: IHexTilesResult[] = [];
    private newTileSteps: INewTileStep[] = [];


    constructor() {

    }

    public generate(wallCityConfig: IWallCityConfig): void {
        this.reset();

        const centerIndex = wallCityConfig.tiles.findIndex(tile => tile.q === wallCityConfig.center.q && tile.r === wallCityConfig.center.r);
        if (centerIndex !== -1) {
            wallCityConfig.tiles.splice(centerIndex, 1);
        }

        this.generateCastle(wallCityConfig.center);
        this.generateBuildings(wallCityConfig.tiles);
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

    private generateCastle(center: IHexCoord): void {
        const randomRotation = ThreeJSHelper.getRandomFromArray([
            HexRotation.Rotate0,
            HexRotation.Rotate60,
            HexRotation.Rotate120,
            HexRotation.Rotate180,
            HexRotation.Rotate240,
            HexRotation.Rotate300
        ]);

        const castle: IHexTilesResult = {
            type: HexTileType.Castle,
            position: center,
            rotation: randomRotation,
        }

        this.hexTilesResults.push(castle);
        this.newTileSteps.push({
            tile: {
                position: center,
                type: HexTileType.Castle,
                rotation: randomRotation,
            },
        });
    }

    private generateBuildings(tiles: IHexCoord[]): void {
        const buildingTypes: HexTileType[] = [
            HexTileType.ArcheryRange,
            HexTileType.Barracks,
            HexTileType.Blacksmith,
            HexTileType.Church,
            HexTileType.HomeA,
            HexTileType.HomeB,
            HexTileType.Market,
            HexTileType.Tavern,
            HexTileType.Well,
            HexTileType.Windmill
        ];
    }
} 