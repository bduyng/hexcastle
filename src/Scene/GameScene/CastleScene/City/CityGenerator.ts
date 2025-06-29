import { AvailableWallTileTypes, BuildingConfig } from "../../../../Data/Configs/CityGeneratorConfig";
import { GameConfig } from "../../../../Data/Configs/GameConfig";
import { HexRotation } from "../../../../Data/Enums/HexRotation";
import { HexTileType } from "../../../../Data/Enums/HexTileType";
import { IBuildingConfig } from "../../../../Data/Interfaces/ICity";
import { IHexCoord } from "../../../../Data/Interfaces/IHexTile";
import { IWallCityConfig } from "../../../../Data/Interfaces/IWall";
import { IHexTilesResult, INewTileStep } from "../../../../Data/Interfaces/IWFC";
import ThreeJSHelper from "../../../../Helpers/ThreeJSHelper";

export class CityGenerator {
    private hexTilesResults: IHexTilesResult[] = [];
    private newTileSteps: INewTileStep[] = [];

    constructor() {

    }

    public generate(wallCityConfig: IWallCityConfig, cityIndex: number): void {
        this.reset();

        const centerIndex = wallCityConfig.tiles.findIndex(tile => tile.q === wallCityConfig.center.q && tile.r === wallCityConfig.center.r);
        if (centerIndex !== -1) {
            wallCityConfig.tiles.splice(centerIndex, 1);
        }

        this.generateCastle(wallCityConfig.center, cityIndex);
        this.generateBuildings(wallCityConfig.tiles, cityIndex);
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

    private generateCastle(center: IHexCoord, cityIndex: number): void {
        const randomRotation = ThreeJSHelper.getRandomFromArray([
            HexRotation.Rotate0,
            HexRotation.Rotate60,
            HexRotation.Rotate120,
            HexRotation.Rotate180,
            HexRotation.Rotate240,
            HexRotation.Rotate300
        ]);

        const castleType = [
            HexTileType.CastleBlue,
            HexTileType.CastleRed
        ]

        const castle: IHexTilesResult = {
            type: castleType[cityIndex],
            position: center,
            rotation: randomRotation,
        }

        this.hexTilesResults.push(castle);
        this.newTileSteps.push({
            tile: {
                position: center,
                type: castleType[cityIndex],
                rotation: randomRotation,
            },
        });
    }

    private generateBuildings(tiles: IHexCoord[], cityIndex: number): void {
        const totalTiles = tiles.length;
        const buildingsToPlace = Math.floor(totalTiles * GameConfig.city.fillPercentage);

        const shuffledTiles = [...tiles].sort(() => Math.random() - 0.5);

        const placedBuildings: { [key in HexTileType]?: number } = {};

        AvailableWallTileTypes[cityIndex].forEach(buildingType => {
            placedBuildings[buildingType] = 0;
        });

        for (let i = 0; i < buildingsToPlace && i < shuffledTiles.length; i++) {
            const position = shuffledTiles[i];

            const selectedBuildingType = this.selectBuildingTypeWithWeightsAndLimits(AvailableWallTileTypes[cityIndex], BuildingConfig, placedBuildings);

            if (!selectedBuildingType) {
                continue;
            }

            const randomRotation = ThreeJSHelper.getRandomFromArray([
                HexRotation.Rotate0,
                HexRotation.Rotate60,
                HexRotation.Rotate120,
                HexRotation.Rotate180,
                HexRotation.Rotate240,
                HexRotation.Rotate300
            ]);

            const building: IHexTilesResult = {
                type: selectedBuildingType,
                position: position,
                rotation: randomRotation,
            };

            this.hexTilesResults.push(building);
            this.newTileSteps.push({
                tile: {
                    position: position,
                    type: selectedBuildingType,
                    rotation: randomRotation,
                },
            });

            placedBuildings[selectedBuildingType]++;
        }
    }

    private selectBuildingTypeWithWeightsAndLimits(
        buildingTypes: HexTileType[],
        config: { [key in HexTileType]?: IBuildingConfig },
        placedBuildings: { [key in HexTileType]?: number }
    ): HexTileType | null {
        const availableBuildingTypes = buildingTypes.filter(buildingType => {
            const buildingConfig = config[buildingType];
            if (!buildingConfig) return true;

            const maxCount = buildingConfig.maxCount;
            if (maxCount === undefined) return true;

            return placedBuildings[buildingType] < maxCount;
        });

        if (availableBuildingTypes.length === 0) {
            return null;
        }

        const weightedArray: HexTileType[] = [];

        availableBuildingTypes.forEach(buildingType => {
            const buildingConfig = config[buildingType];
            const weight = buildingConfig?.weight || 1.0;
            const count = Math.max(1, Math.round(weight * 10));

            for (let i = 0; i < count; i++) {
                weightedArray.push(buildingType);
            }
        });

        return ThreeJSHelper.getRandomFromArray(weightedArray);
    }
} 