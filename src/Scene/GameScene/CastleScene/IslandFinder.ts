import { IHexCoord } from '../../../Data/Interfaces/IHexTile';
import { IIsland } from '../../../Data/Interfaces/IIsland';
import HexGridHelper from '../../../Helpers/HexGridHelper';

export default class IslandFinder {
    constructor() {
        
    }

    public findIslands(topLevelAvailability: IHexCoord[]): IIsland[] {
        const visited = new Set<string>();
        const islands: IIsland[] = [];

        for (const tile of topLevelAvailability) {
            const key = this.coordToKey(tile);

            if (!visited.has(key)) {
                const islandTiles = this.dfsFindIsland(tile, topLevelAvailability, visited);

                const island = this.createIsland(islandTiles);
                islands.push(island);
            }
        }

        return islands;
    }

    public findIslandsWithMinSize(topLevelAvailability: IHexCoord[], minSize: number): IIsland[] {
        const allIslands = this.findIslands(topLevelAvailability);
        const filteredIslands = allIslands.filter(island => island.area >= minSize && this.isIslandValid(island, topLevelAvailability, minSize));
        return filteredIslands.sort((a, b) => b.radiusAvailable - a.radiusAvailable);
    }

    private dfsFindIsland(startTile: IHexCoord, availableTiles: IHexCoord[], visited: Set<string>): IHexCoord[] {
        const island: IHexCoord[] = [];
        const stack: IHexCoord[] = [startTile];

        while (stack.length > 0) {
            const current = stack.pop()!;
            const key = this.coordToKey(current);

            if (visited.has(key)) {
                continue;
            }

            visited.add(key);
            island.push(current);

            const neighbors = HexGridHelper.getHexNeighbors(current);

            for (const neighbor of neighbors) {
                const neighborKey = this.coordToKey(neighbor);
                const isAvailable = this.isTileAvailable(neighbor, availableTiles);

                if (isAvailable && !visited.has(neighborKey)) {
                    stack.push(neighbor);
                }
            }
        }

        return island;
    }

    private createIsland(tiles: IHexCoord[]): IIsland {
        const center = this.calculateIslandCenter(tiles);
        const radius = this.calculateIslandRadius(tiles, center);
        const area = tiles.length;
        const perimeter = this.calculateIslandPerimeter(tiles);
        const radiusAvailable = this.calculateMaxRadiusAroundTile(center, tiles);

        return {
            tiles,
            center,
            radius,
            area,
            perimeter,
            radiusAvailable
        };
    }

    private calculateIslandCenter(tiles: IHexCoord[]): IHexCoord {
        if (tiles.length === 0) {
            return { q: 0, r: 0 };
        }

        let bestCenter = tiles[0];
        let maxRadius = 0;

        for (const candidate of tiles) {
            const radius = this.calculateMaxRadiusAroundTile(candidate, tiles);
            if (radius > maxRadius) {
                maxRadius = radius;
                bestCenter = candidate;
            }
        }

        return bestCenter;
    }

    private calculateMaxRadiusAroundTile(center: IHexCoord, availableTiles: IHexCoord[]): number {
        let radius = 0;
        
        while (true) {
            const nextRadius = radius + 1;
            let allTilesInRadiusAvailable = true;
            
            for (let r = -nextRadius; r <= nextRadius; r++) {
                for (let q = -nextRadius; q <= nextRadius; q++) {
                    const s = -q - r;
                    if (Math.abs(s) <= nextRadius) {
                        const tile = { q: center.q + q, r: center.r + r };
                        if (!this.isTileAvailable(tile, availableTiles)) {
                            allTilesInRadiusAvailable = false;
                            break;
                        }
                    }
                }
                if (!allTilesInRadiusAvailable) break;
            }
            
            if (allTilesInRadiusAvailable) {
                radius = nextRadius;
            } else {
                break;
            }
        }
        
        return radius;
    }

    private calculateIslandRadius(tiles: IHexCoord[], center: IHexCoord): number {
        let maxDistance = 0;

        for (const tile of tiles) {
            const distance = this.getHexDistance(center, tile);
            maxDistance = Math.max(maxDistance, distance);
        }

        return maxDistance;
    }

    private calculateIslandPerimeter(tiles: IHexCoord[]): number {
        const islandSet = new Set<string>();
        for (const tile of tiles) {
            islandSet.add(this.coordToKey(tile));
        }

        let perimeter = 0;

        for (const tile of tiles) {
            const neighbors = HexGridHelper.getHexNeighbors(tile);

            for (const neighbor of neighbors) {
                const neighborKey = this.coordToKey(neighbor);
                if (!islandSet.has(neighborKey)) {
                    perimeter++;
                }
            }
        }

        return perimeter;
    }

    private getHexDistance(coord1: IHexCoord, coord2: IHexCoord): number {
        const dq = coord1.q - coord2.q;
        const dr = coord1.r - coord2.r;
        const ds = -dq - dr;

        return Math.max(Math.abs(dq), Math.abs(dr), Math.abs(ds));
    }


    private isTileAvailable(tile: IHexCoord, availableTiles: IHexCoord[]): boolean {
        return availableTiles.some(availableTile =>
            availableTile.q === tile.q && availableTile.r === tile.r
        );
    }

    private coordToKey(coord: IHexCoord): string {
        return `${coord.q},${coord.r}`;
    }

    private isIslandValid(island: IIsland, availableTiles: IHexCoord[], radius: number): boolean {
        const center = island.center;
        
        for (let r = -radius; r <= radius; r++) {
            for (let q = -radius; q <= radius; q++) {
                const s = -q - r;
                if (Math.abs(s) <= radius) {
                    const tile = { q: center.q + q, r: center.r + r };
                    if (!this.isTileAvailable(tile, availableTiles)) {
                        return false;
                    }
                }
            }
        }
        
        return true;
    }
} 