import { HexTileType } from "../../../../Data/Enums/HexTileType";
import { HexRotation } from "../../../../Data/Enums/HexRotation";
import { IHexCoord } from "../../../../Data/Interfaces/IHexTile";
import { IHexTilesResult, INewTileStep } from "../../../../Data/Interfaces/IWFC";
import HexGridHelper from "../../../../Helpers/HexGridHelper";
import { INatureTileConfig } from "../../../../Data/Interfaces/INature";
import { NatureConfig, SingleTiles, TreesTiles, RocksTiles } from "../../../../Data/Configs/NatureGeneratorConfig";
import { GameConfig } from "../../../../Data/Configs/GameConfig";

export class NatureGenerator {
    private hexTilesResults: IHexTilesResult[] = [];
    private newTileSteps: INewTileStep[] = [];
    private availableTiles: Set<string> = new Set();
    private placedTiles: Set<string> = new Set();

    constructor() {

    }

    public generate(tiles: IHexCoord[]): void {
        this.reset();

        this.availableTiles.clear();
        tiles.forEach(tile => {
            this.availableTiles.add(this.coordToKey(tile));
        });

        this.generateClusteredTiles(TreesTiles, GameConfig.nature.clusterSettings.trees);
        this.generateClusteredTiles(RocksTiles, GameConfig.nature.clusterSettings.rocks);
        this.generateScatteredTiles(SingleTiles, GameConfig.nature.clusterSettings.hills);
    }

    private generateClusteredTiles(tileTypes: HexTileType[], clusterConfig: any): void {
        for (const tileType of tileTypes) {
            const tileConfig = NatureConfig[tileType];
            if (!tileConfig) continue;

            const targetCount = Math.floor(this.availableTiles.size * clusterConfig.fillPercentage * GameConfig.nature.overallFillPercentage);
            let placedCount = 0;
            let attempts = 0;
            const maxAttempts = targetCount * 10;

            while (placedCount < targetCount && attempts < maxAttempts && this.availableTiles.size > 0) {
                attempts++;

                if (Math.random() < clusterConfig.clusterChance || placedCount === 0) {
                    const clusterSize = Math.min(
                        Math.floor(Math.random() * clusterConfig.maxClusterSize) + 1,
                        this.availableTiles.size
                    );

                    const clusterPlaced = this.generateCluster(tileType, clusterSize, tileConfig, clusterConfig);
                    placedCount += clusterPlaced;
                }
            }
        }
    }

    private generateCluster(tileType: HexTileType, clusterSize: number, tileConfig: INatureTileConfig, clusterConfig: any): number {
        const availableCoords = Array.from(this.availableTiles).map(key => this.keyToCoord(key));
        if (availableCoords.length === 0) return 0;

        const startCoord = availableCoords[Math.floor(Math.random() * availableCoords.length)];
        const cluster: IHexCoord[] = [startCoord];
        const visited = new Set<string>();
        visited.add(this.coordToKey(startCoord));

        let placedCount = 0;
        const maxClusterAttempts = clusterSize * 5;

        for (let i = 0; i < maxClusterAttempts && cluster.length < clusterSize; i++) {
            const currentCoord = cluster[Math.floor(Math.random() * cluster.length)];
            const neighbors = HexGridHelper.getHexNeighbors(currentCoord);

            const availableNeighbors = neighbors.filter(neighbor => {
                const key = this.coordToKey(neighbor);
                return this.availableTiles.has(key) && !visited.has(key);
            });

            if (availableNeighbors.length === 0) continue;

            const selectedNeighbor = this.selectNeighborWithWeight(availableNeighbors, tileConfig);
            const neighborKey = this.coordToKey(selectedNeighbor);

            const distanceFromCenter = this.getDistance(startCoord, selectedNeighbor);
            const placementChance = Math.max(0.1, 1.0 - (distanceFromCenter / clusterConfig.maxClusterSize));

            if (Math.random() < placementChance) {
                cluster.push(selectedNeighbor);
                visited.add(neighborKey);

                const rotation = this.getRandomRotation();
                const tile: IHexTilesResult = {
                    type: tileType,
                    position: selectedNeighbor,
                    rotation: rotation
                };

                this.hexTilesResults.push(tile);
                this.newTileSteps.push({
                    tile: {
                        position: selectedNeighbor,
                        type: tileType,
                        rotation: rotation
                    }
                });

                this.availableTiles.delete(neighborKey);
                this.placedTiles.add(neighborKey);
                placedCount++;
            }
        }

        return placedCount;
    }

    private generateScatteredTiles(tileTypes: HexTileType[], clusterConfig: any): void {
        for (const tileType of tileTypes) {
            const tileConfig = NatureConfig[tileType];
            if (!tileConfig) continue;

            const targetCount = Math.floor(this.availableTiles.size * clusterConfig.fillPercentage * GameConfig.nature.overallFillPercentage);
            let placedCount = 0;
            let attempts = 0;
            const maxAttempts = targetCount * 5;

            while (placedCount < targetCount && attempts < maxAttempts && this.availableTiles.size > 0) {
                attempts++;

                const availableCoords = Array.from(this.availableTiles).map(key => this.keyToCoord(key));
                if (availableCoords.length === 0) break;

                const randomCoord = availableCoords[Math.floor(Math.random() * availableCoords.length)];
                const coordKey = this.coordToKey(randomCoord);

                const neighborDensity = this.getNeighborDensity(randomCoord, tileType);
                const placementChance = Math.min(0.8, 0.2 + neighborDensity * 0.3);

                if (Math.random() < placementChance) {
                    const rotation = this.getRandomRotation();
                    const tile: IHexTilesResult = {
                        type: tileType,
                        position: randomCoord,
                        rotation: rotation
                    };

                    this.hexTilesResults.push(tile);
                    this.newTileSteps.push({
                        tile: {
                            position: randomCoord,
                            type: tileType,
                            rotation: rotation
                        }
                    });

                    this.availableTiles.delete(coordKey);
                    this.placedTiles.add(coordKey);
                    placedCount++;
                }
            }
        }
    }

    private selectNeighborWithWeight(neighbors: IHexCoord[], tileConfig: INatureTileConfig): IHexCoord {
        const weights: number[] = [];

        for (const neighbor of neighbors) {
            let weight = tileConfig.weight;

            const similarNeighbors = this.countSimilarNeighbors(neighbor, tileConfig);
            weight += similarNeighbors * 0.5;

            weights.push(weight);
        }

        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
        let random = Math.random() * totalWeight;

        for (let i = 0; i < neighbors.length; i++) {
            random -= weights[i];
            if (random <= 0) {
                return neighbors[i];
            }
        }

        return neighbors[0];
    }

    private countSimilarNeighbors(coord: IHexCoord, tileConfig: INatureTileConfig): number {
        const neighbors = HexGridHelper.getHexNeighbors(coord);
        let count = 0;

        for (const neighbor of neighbors) {
            const key = this.coordToKey(neighbor);
            if (this.placedTiles.has(key)) {
                const placedTile = this.hexTilesResults.find(tile =>
                    tile.position.q === neighbor.q && tile.position.r === neighbor.r
                );

                if (placedTile && this.isSimilarType(placedTile.type, tileConfig)) {
                    count++;
                }
            }
        }

        return count;
    }

    private isSimilarType(tileType: HexTileType, tileConfig: INatureTileConfig): boolean {
        const isTree = TreesTiles.includes(tileType);
        const isMountain = RocksTiles.includes(tileType);
        const isHill = SingleTiles.includes(tileType);

        const configType = tileConfig.type;
        if (!configType) return false;

        const configIsTree = TreesTiles.includes(configType);
        const configIsMountain = RocksTiles.includes(configType);
        const configIsHill = SingleTiles.includes(configType);

        return (isTree && configIsTree) || (isMountain && configIsMountain) || (isHill && configIsHill);
    }

    private getNeighborDensity(coord: IHexCoord, tileType: HexTileType): number {
        const neighbors = HexGridHelper.getHexNeighbors(coord);
        let similarCount = 0;

        for (const neighbor of neighbors) {
            const key = this.coordToKey(neighbor);
            if (this.placedTiles.has(key)) {
                const placedTile = this.hexTilesResults.find(tile =>
                    tile.position.q === neighbor.q && tile.position.r === neighbor.r
                );

                if (placedTile && this.areSimilarTypes(placedTile.type, tileType)) {
                    similarCount++;
                }
            }
        }

        return similarCount / 6;
    }

    private areSimilarTypes(tileType1: HexTileType, tileType2: HexTileType): boolean {
        const isTree1 = TreesTiles.includes(tileType1);
        const isMountain1 = RocksTiles.includes(tileType1);
        const isHill1 = SingleTiles.includes(tileType1);

        const isTree2 = TreesTiles.includes(tileType2);
        const isMountain2 = RocksTiles.includes(tileType2);
        const isHill2 = SingleTiles.includes(tileType2);

        return (isTree1 && isTree2) || (isMountain1 && isMountain2) || (isHill1 && isHill2);
    }

    private getDistance(coord1: IHexCoord, coord2: IHexCoord): number {
        return Math.max(
            Math.abs(coord1.q - coord2.q),
            Math.abs(coord1.r - coord2.r),
            Math.abs(coord1.q + coord1.r - coord2.q - coord2.r)
        );
    }

    private getRandomRotation(): HexRotation {
        const rotations = [
            HexRotation.Rotate0,
            HexRotation.Rotate60,
            HexRotation.Rotate120,
            HexRotation.Rotate180,
            HexRotation.Rotate240,
            HexRotation.Rotate300
        ];

        return rotations[Math.floor(Math.random() * rotations.length)];
    }

    private coordToKey(coord: IHexCoord): string {
        return `${coord.q},${coord.r}`;
    }

    private keyToCoord(key: string): IHexCoord {
        const [q, r] = key.split(',').map(Number);
        return { q, r };
    }

    public reset(): void {
        this.hexTilesResults = [];
        this.newTileSteps = [];
        this.availableTiles.clear();
        this.placedTiles.clear();
    }

    public getSteps(): INewTileStep[] {
        return this.newTileSteps;
    }

    public getTiles(): IHexTilesResult[] {
        return this.hexTilesResults;
    }
} 