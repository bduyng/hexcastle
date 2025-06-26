import { IHexCoord } from "../../../../Data/Interfaces/IHexTile";
import { HexTileType } from "../../../../Data/Enums/HexTileType";
import { TileEdgeType } from "../../../../Data/Enums/TileEdgeType";
import { HexRotation } from "../../../../Data/Enums/HexRotation";
import { IHexTilesResult, INewTileStep, ITileVariant } from "../../../../Data/Interfaces/IWFC";
import { IWallConfig, IWallGateConfig } from "../../../../Data/Interfaces/IWall";
import { WallGateTiles, WallTileTypes } from "../../../../Data/Configs/WallGeneratorConfig";
import { NeighborDirections } from "../../../../Data/Configs/WFCConfig";
import HexGridHelper from "../../../../Helpers/HexGridHelper";
import { WallTilesRulesConfig } from "../../../../Data/Configs/WallTilesRulesConfig";

export class WallGenerator {
    private wallTileVariants: ITileVariant[] = [];
    private steps: INewTileStep[] = [];
    private resultTiles: IHexTilesResult[] = [];
    private insideTiles: IHexCoord[] = [];
    private outsideTiles: IHexCoord[] = [];

    constructor() {

    }

    public generate(shape: IWallConfig): void {
        this.reset();
        
        if (this.wallTileVariants.length === 0) {
            this.initializeWallTileVariants();
        }

        const wallTiles: IHexTilesResult[] = [];

        const baseRing = this.generateHexRing(shape.center, shape.radius);
        const offsetRing = this.applyOffsetToRing(baseRing, shape.maxOffset);
        const filteredRing = this.filterSingleConnectionTiles(offsetRing);
        const uniqueRing = this.removeDuplicateTiles(filteredRing);

        const wallCoords = uniqueRing.map(coord => ({ coord }));

        const tempWallTiles: IHexTilesResult[] = wallCoords.map(wc => ({
            type: HexTileType.WallStraight,
            position: wc.coord,
            rotation: HexRotation.Rotate0
        }));

        const insideTiles = this.insideTiles = this.findTilesInsideWall(tempWallTiles, shape.center);
        const outsideAdjacentTiles = this.outsideTiles = this.findOutsideAdjacentTiles(tempWallTiles, insideTiles);

        for (let i = 0; i < wallCoords.length; i++) {
            const wallTile = wallCoords[i];
            const tileVariant = this.determineWallTileType(wallTile.coord, wallCoords, i, insideTiles, outsideAdjacentTiles);
            wallTiles.push({
                type: tileVariant.type,
                position: wallTile.coord,
                rotation: tileVariant.rotation
            });
        }

        this.resultTiles = this.addGatesToWall(wallTiles);

        this.generateSteps(this.resultTiles);
    }

    public getTiles(): IHexTilesResult[] {
        return this.resultTiles;
    }

    public getSteps(): INewTileStep[] {
        return this.steps;
    }

    public getInsideTiles(): IHexCoord[] {
        return this.insideTiles;
    }

    public getOutsideTiles(): IHexCoord[] {
        return this.outsideTiles;
    }

    public reset(): void {
        this.steps = [];
        this.wallTileVariants = [];
        this.resultTiles = [];
        this.insideTiles = [];
        this.outsideTiles = [];
    }

    private generateSteps(tiles: IHexTilesResult[]): void {
        for (let i = 0; i < tiles.length; i++) {
            const wallTile = tiles[i];
            const step: INewTileStep = {
                tile: {
                    position: wallTile.position,
                    type: wallTile.type,
                    rotation: wallTile.rotation
                }
            };

            this.steps.push(step);
        }
    }

    private initializeWallTileVariants(): void {
        this.wallTileVariants = [];

        for (const tileType of WallTileTypes) {
            const tileRule = WallTilesRulesConfig.find(rule => rule.type === tileType);
            if (!tileRule) continue;

            for (let rotation = 0; rotation < 6; rotation++) {
                const rotatedEdges = this.rotateEdges(tileRule.edges, rotation);
                this.wallTileVariants.push({
                    type: tileType,
                    rotation: rotation as HexRotation,
                    edges: rotatedEdges
                });
            }
        }
    }

    private rotateEdges(edges: TileEdgeType[], rotation: number): TileEdgeType[] {
        const rotated = [...edges];
        for (let i = 0; i < rotation; i++) {
            rotated.unshift(rotated.pop()!);
        }

        return rotated;
    }

    private applyOffsetToRing(ring: IHexCoord[], maxOffset: number): IHexCoord[] {
        if (maxOffset === 0 || ring.length === 0) {
            return ring;
        }

        const offsetRing: IHexCoord[] = [];
        const center = this.calculateRingCenter(ring);

        for (let i = 0; i < ring.length; i++) {
            const coord = ring[i];

            const directionQ = coord.q - center.q;
            const directionR = coord.r - center.r;

            const length = Math.sqrt(directionQ * directionQ + directionR * directionR);
            const normalizedQ = length > 0 ? directionQ / length : 0;
            const normalizedR = length > 0 ? directionR / length : 0;

            const offset = Math.floor(Math.random() * (maxOffset + 1));
            const offsetCoord = {
                q: coord.q + Math.round(normalizedQ * offset),
                r: coord.r + Math.round(normalizedR * offset)
            };

            offsetRing.push(offsetCoord);
        }

        return this.fixRingConnectivity(offsetRing);
    }

    private calculateRingCenter(ring: IHexCoord[]): IHexCoord {
        if (ring.length === 0) {
            return { q: 0, r: 0 };
        }

        const sumQ = ring.reduce((sum, coord) => sum + coord.q, 0);
        const sumR = ring.reduce((sum, coord) => sum + coord.r, 0);

        return {
            q: Math.round(sumQ / ring.length),
            r: Math.round(sumR / ring.length)
        };
    }

    private fixRingConnectivity(ring: IHexCoord[]): IHexCoord[] {
        if (ring.length < 2) {
            return ring;
        }

        const fixedRing: IHexCoord[] = [];

        for (let i = 0; i < ring.length; i++) {
            const current = ring[i];
            const next = ring[(i + 1) % ring.length];

            fixedRing.push(current);

            const distance = this.getHexDistance(current, next);

            if (distance > 1) {
                const intermediatePoints = this.getPathBetweenPoints(current, next);
                fixedRing.push(...intermediatePoints);
            }
        }

        return fixedRing;
    }

    private getPathBetweenPoints(start: IHexCoord, end: IHexCoord): IHexCoord[] {
        const path: IHexCoord[] = [];
        const distance = this.getHexDistance(start, end);

        if (distance <= 1) {
            return path;
        }

        let current = { ...start };

        while (this.getHexDistance(current, end) > 1) {
            const dq = end.q - current.q;
            const dr = end.r - current.r;

            let stepQ = 0;
            let stepR = 0;

            if (Math.abs(dq) > Math.abs(dr)) {
                stepQ = dq > 0 ? 1 : -1;
            } else {
                stepR = dr > 0 ? 1 : -1;
            }

            current = {
                q: current.q + stepQ,
                r: current.r + stepR
            };

            path.push({ ...current });
        }

        return path;
    }

    private generateHexRing(center: IHexCoord, radius: number): IHexCoord[] {
        const ring: IHexCoord[] = [];

        if (radius === 0) {
            return [center];
        }

        for (let q = -radius; q <= radius; q++) {
            for (let r = -radius; r <= radius; r++) {
                const s = -q - r;

                if (Math.max(Math.abs(q), Math.abs(r), Math.abs(s)) === radius) {
                    ring.push({
                        q: center.q + q,
                        r: center.r + r
                    });
                }
            }
        }

        ring.sort((a, b) => {
            const angleA = Math.atan2(a.r - center.r, a.q - center.q);
            const angleB = Math.atan2(b.r - center.r, b.q - center.q);
            return angleA - angleB;
        });

        return ring;
    }

    private getHexDistance(coord1: IHexCoord, coord2: IHexCoord): number {
        const dq = coord1.q - coord2.q;
        const dr = coord1.r - coord2.r;
        const ds = -dq - dr;

        return Math.max(Math.abs(dq), Math.abs(dr), Math.abs(ds));
    }

    private determineWallTileType(coord: IHexCoord, wallCoords: { coord: IHexCoord }[], currentIndex: number, insideTiles: IHexCoord[], outsideAdjacentTiles: IHexCoord[]): ITileVariant {
        const prevIndex = (currentIndex - 1 + wallCoords.length) % wallCoords.length;
        const nextIndex = (currentIndex + 1) % wallCoords.length;

        const prevCoord = wallCoords[prevIndex].coord;
        const nextCoord = wallCoords[nextIndex].coord;

        let prevDirection = -1;
        let nextDirection = -1;

        for (let i = 0; i < NeighborDirections.length; i++) {
            const neighborCoord = {
                q: coord.q + NeighborDirections[i].q,
                r: coord.r + NeighborDirections[i].r
            };

            if (neighborCoord.q === prevCoord.q && neighborCoord.r === prevCoord.r) {
                prevDirection = i;
            }

            if (neighborCoord.q === nextCoord.q && neighborCoord.r === nextCoord.r) {
                nextDirection = i;
            }
        }

        const requiredWallEdges: boolean[] = [false, false, false, false, false, false];

        if (prevDirection !== -1) {
            requiredWallEdges[prevDirection] = true;
        }

        if (nextDirection !== -1) {
            requiredWallEdges[nextDirection] = true;
        }

        const requiredInsideEdges: boolean[] = [false, false, false, false, false, false];
        const requiredOutsideEdges: boolean[] = [false, false, false, false, false, false];

        for (let i = 0; i < 6; i++) {
            if (!requiredWallEdges[i]) {
                const neighborCoord = {
                    q: coord.q + NeighborDirections[i].q,
                    r: coord.r + NeighborDirections[i].r
                };

                const isWallNeighbor = wallCoords.some(wallCoord =>
                    wallCoord.coord.q === neighborCoord.q && wallCoord.coord.r === neighborCoord.r
                );

                if (!isWallNeighbor) {
                    const isInsideTile = insideTiles.some(insideTile =>
                        insideTile.q === neighborCoord.q && insideTile.r === neighborCoord.r
                    );

                    const isOutsideTile = outsideAdjacentTiles.some(outsideTile =>
                        outsideTile.q === neighborCoord.q && outsideTile.r === neighborCoord.r
                    );

                    if (isInsideTile) {
                        requiredInsideEdges[i] = true;
                    } else if (isOutsideTile) {
                        requiredOutsideEdges[i] = true;
                    }
                }
            }
        }

        for (const variant of this.wallTileVariants) {
            let isCompatible = true;

            for (let i = 0; i < 6; i++) {
                const requiredWall = requiredWallEdges[i];
                const requiredInside = requiredInsideEdges[i];
                const requiredOutside = requiredOutsideEdges[i];
                const tileEdge = variant.edges[i];

                if (requiredWall && tileEdge !== TileEdgeType.Wall) {
                    isCompatible = false;
                    break;
                }

                if (!requiredWall && tileEdge === TileEdgeType.Wall) {
                    isCompatible = false;
                    break;
                }

                if (requiredInside && tileEdge !== TileEdgeType.Inside) {
                    isCompatible = false;
                    break;
                }

                if (requiredOutside && tileEdge !== TileEdgeType.Outside) {
                    isCompatible = false;
                    break;
                }
            }

            if (isCompatible) {
                return variant;
            }
        }

        const fallbackVariant = this.wallTileVariants.find(variant => variant.type === HexTileType.WallStraight && variant.rotation === HexRotation.Rotate0);
        return fallbackVariant || this.wallTileVariants[0];
    }

    public findTilesInsideWall(wallTiles: IHexTilesResult[], center: IHexCoord): IHexCoord[] {
        const wallCoordsSet = new Set<string>();
        for (const wallTile of wallTiles) {
            wallCoordsSet.add(`${wallTile.position.q},${wallTile.position.r}`);
        }

        const bounds = this.calculateBounds(wallTiles);

        const insideTiles: IHexCoord[] = [];
        const visited = new Set<string>();

        const queue: IHexCoord[] = [center];

        while (queue.length > 0) {
            const current = queue.shift()!;
            const key = `${current.q},${current.r}`;

            if (visited.has(key)) {
                continue;
            }

            visited.add(key);

            if (!wallCoordsSet.has(key)) {
                insideTiles.push(current);

                const neighbors = HexGridHelper.getHexNeighbors(current);
                for (const neighbor of neighbors) {
                    const neighborKey = `${neighbor.q},${neighbor.r}`;

                    if (this.isWithinBounds(neighbor, bounds) &&
                        !visited.has(neighborKey) &&
                        !wallCoordsSet.has(neighborKey)) {
                        queue.push(neighbor);
                    }
                }
            }
        }

        return insideTiles;
    }

    private calculateBounds(wallTiles: IHexTilesResult[]): { minQ: number, maxQ: number, minR: number, maxR: number } {
        if (wallTiles.length === 0) {
            return { minQ: 0, maxQ: 0, minR: 0, maxR: 0 };
        }

        let minQ = wallTiles[0].position.q;
        let maxQ = wallTiles[0].position.q;
        let minR = wallTiles[0].position.r;
        let maxR = wallTiles[0].position.r;

        for (const wallTile of wallTiles) {
            minQ = Math.min(minQ, wallTile.position.q);
            maxQ = Math.max(maxQ, wallTile.position.q);
            minR = Math.min(minR, wallTile.position.r);
            maxR = Math.max(maxR, wallTile.position.r);
        }

        return { minQ, maxQ, minR, maxR };
    }

    private isWithinBounds(coord: IHexCoord, bounds: { minQ: number, maxQ: number, minR: number, maxR: number }): boolean {
        return coord.q >= bounds.minQ && coord.q <= bounds.maxQ &&
            coord.r >= bounds.minR && coord.r <= bounds.maxR;
    }

    public findOutsideAdjacentTiles(wallTiles: IHexTilesResult[], insideTiles: IHexCoord[]): IHexCoord[] {
        const wallCoordsSet = new Set<string>();
        const insideCoordsSet = new Set<string>();

        for (const wallTile of wallTiles) {
            wallCoordsSet.add(`${wallTile.position.q},${wallTile.position.r}`);
        }

        for (const insideTile of insideTiles) {
            insideCoordsSet.add(`${insideTile.q},${insideTile.r}`);
        }

        const bounds = this.calculateBounds(wallTiles);

        const outsideAdjacentTiles = new Set<string>();

        for (const wallTile of wallTiles) {
            const neighbors = HexGridHelper.getHexNeighbors(wallTile.position);

            for (const neighbor of neighbors) {
                const neighborKey = `${neighbor.q},${neighbor.r}`;

                if (!wallCoordsSet.has(neighborKey) && !insideCoordsSet.has(neighborKey)) {
                    if (this.isWithinExtendedBounds(neighbor, bounds)) {
                        outsideAdjacentTiles.add(neighborKey);
                    }
                }
            }
        }

        return Array.from(outsideAdjacentTiles).map(key => {
            const [q, r] = key.split(',').map(Number);
            return { q, r };
        });
    }

    private isWithinExtendedBounds(coord: IHexCoord, bounds: { minQ: number, maxQ: number, minR: number, maxR: number }): boolean {
        const margin = 2;
        return coord.q >= bounds.minQ - margin && coord.q <= bounds.maxQ + margin &&
            coord.r >= bounds.minR - margin && coord.r <= bounds.maxR + margin;
    }

    private filterSingleConnectionTiles(ring: IHexCoord[]): IHexCoord[] {
        if (ring.length <= 2) {
            return ring;
        }

        const filteredRing: IHexCoord[] = [];

        for (let i = 0; i < ring.length; i++) {
            const currentCoord = ring[i];
            const connections = this.countWallConnections(currentCoord, ring);

            if (connections >= 2) {
                filteredRing.push(currentCoord);
            }
        }

        return filteredRing;
    }

    private countWallConnections(coord: IHexCoord, ring: IHexCoord[]): number {
        let connections = 0;

        for (const direction of NeighborDirections) {
            const neighborCoord = {
                q: coord.q + direction.q,
                r: coord.r + direction.r
            };

            const hasNeighbor = ring.some(ringCoord =>
                ringCoord.q === neighborCoord.q && ringCoord.r === neighborCoord.r
            );

            if (hasNeighbor) {
                connections++;
            }
        }

        return connections;
    }

    private removeDuplicateTiles(ring: IHexCoord[]): IHexCoord[] {
        const uniqueRing: IHexCoord[] = [];
        const seen = new Set<string>();

        for (const coord of ring) {
            const key = `${coord.q},${coord.r}`;
            if (!seen.has(key)) {
                seen.add(key);
                uniqueRing.push(coord);
            }
        }

        return uniqueRing;
    }

    private addGatesToWall(wallTiles: IHexTilesResult[]): IHexTilesResult[] {
        const wallTilesResult: IHexTilesResult[] = [...wallTiles]

        for (let i = 0; i < wallTiles.length; i++) {
            const wallTile = wallTiles[i];
            const tileGateConfig: IWallGateConfig = WallGateTiles.find(gate => gate.replace === wallTile.type);

            if (tileGateConfig) {
                const changeTile = Math.random() < tileGateConfig.probability;
                if (changeTile) {
                    wallTilesResult[i] = {
                        type: tileGateConfig.type,
                        position: wallTile.position,
                        rotation: wallTile.rotation
                    };
                }
            }
        }

        return wallTilesResult;
    }
} 