import { EdgeType } from "../../Data/Configs/CellsRules";
import { GroundCellType } from "../../Data/Enums/GroundCellType";
import { HexCoord } from "../../Data/Interfaces/ICell";

export interface BaseTileDefinition {
    type: GroundCellType;
    edges: EdgeType[]; // [s0, s1, s2, s3, s4, s5]
    weight: number;
}

export interface ResolvedCell {
    coord: HexCoord;
    type: GroundCellType;
    rotation: number;
}

export interface TilePrototype {
    type: GroundCellType;
    rotation: number; // 0–5
    weight: number;
    edges: EdgeType[]; // [s0, s1, ..., s5]
}

export class HexWFC {
    private grid: Map<string, Set<number>> = new Map();
    private tilePrototypes: TilePrototype[] = [];

    constructor(private baseTileDefinitions: {
        type: GroundCellType;
        edges: EdgeType[];
        weight: number;
    }[]) {
        this.tilePrototypes = this.generateRotatedTilePrototypes();
    }

    public initializeGrid(radius: number) {
        this.grid.clear();

        for (let q = -radius; q <= radius; q++) {
            const r1 = Math.max(-radius, -q - radius);
            const r2 = Math.min(radius, -q + radius);
            for (let r = r1; r <= r2; r++) {
                const key = `${q},${r}`;
                this.grid.set(key, new Set(this.tilePrototypes.map((_, i) => i)));
            }
        }
    }

    public run(adjacencyMap: Map<number, Map<number, Set<number>>>): ResolvedCell[] {
        const resolved: Map<string, number> = new Map();
        const queue: string[] = [];

        const pickWeightedRandom = (options: number[]): number => {
            const weights = options.map(i => this.tilePrototypes[i].weight);
            const total = weights.reduce((a, b) => a + b, 0);
            let rand = Math.random() * total;
            for (let i = 0; i < options.length; i++) {
                rand -= weights[i];
                if (rand <= 0) return options[i];
            }
            return options[options.length - 1];
        };

        const getNeighbors = (q: number, r: number): [number, number, string, number][] => {
            const directions: HexCoord[] = [
                { q: +1, r: 0 },
                { q: +1, r: -1 },
                { q: 0, r: -1 },
                { q: -1, r: 0 },
                { q: -1, r: +1 },
                { q: 0, r: +1 },
            ];
            return directions.map((dir, i) => {
                const nq = q + dir.q;
                const nr = r + dir.r;
                const key = `${nq},${nr}`;
                return [nq, nr, key, i];
            });
        };

        while (true) {
            // Find cell with lowest entropy
            let minEntropy = Infinity;
            let minCellKey: string | null = null;

            for (const [key, options] of this.grid) {
                if (options.size <= 1 || resolved.has(key)) continue;
                const entropy = options.size;
                if (entropy < minEntropy) {
                    minEntropy = entropy;
                    minCellKey = key;
                }
            }

            if (!minCellKey) break;

            const options = this.grid.get(minCellKey)!;
            const picked = pickWeightedRandom([...options]);
            this.grid.set(minCellKey, new Set([picked]));
            resolved.set(minCellKey, picked);
            queue.push(minCellKey);

            while (queue.length > 0) {
                const currentKey = queue.shift()!;
                const [q, r] = currentKey.split(',').map(Number);
                const currentTile = [...this.grid.get(currentKey)!][0];

                for (const [nq, nr, neighborKey, dir] of getNeighbors(q, r)) {
                    if (!this.grid.has(neighborKey)) continue;

                    const neighborOptions = this.grid.get(neighborKey)!;
                    const allowed = new Set<number>();

                    for (const neighborIndex of neighborOptions) {
                        const compatible = adjacencyMap.get(currentTile)!.get(dir)!;
                        if (compatible.has(neighborIndex)) {
                            allowed.add(neighborIndex);
                        }
                    }

                    if (allowed.size < neighborOptions.size) {
                        if (allowed.size === 0) {
                            console.warn(`Contradiction at ${neighborKey}`);
                            return [];
                        }

                        this.grid.set(neighborKey, allowed);
                        queue.push(neighborKey);
                    }
                }
            }
        }

        const result: ResolvedCell[] = [];

        for (const [key, tileSet] of this.grid.entries()) {
            if (tileSet.size !== 1) continue;
            const [q, r] = key.split(',').map(Number);
            const tile = this.tilePrototypes[[...tileSet][0]];
            result.push({ coord: { q, r }, type: tile.type, rotation: tile.rotation });
        }

        return result;
    }

    public generateAdjacencyMap(): Map<number, Map<number, Set<number>>> {
        const map = new Map<number, Map<number, Set<number>>>();

        const isCompatible = (a: TilePrototype, b: TilePrototype, direction: number): boolean => {
            const aEdge = a.edges[direction];
            const bEdge = b.edges[(direction + 3) % 6];
            return aEdge === bEdge;
        };

        for (let i = 0; i < this.tilePrototypes.length; i++) {
            const compatibleDirs = new Map<number, Set<number>>();
            for (let dir = 0; dir < 6; dir++) {
                const set = new Set<number>();
                for (let j = 0; j < this.tilePrototypes.length; j++) {
                    if (isCompatible(this.tilePrototypes[i], this.tilePrototypes[j], dir)) {
                        set.add(j);
                    }
                }
                compatibleDirs.set(dir, set);
            }
            map.set(i, compatibleDirs);
        }

        return map;
    }

    private rotateEdges<T>(edges: T[], rotation: number): T[] {
        const len = edges.length;
        return edges.map((_, i) => edges[(i - rotation + len) % len]);
    }

    private generateRotatedTilePrototypes(): TilePrototype[] {
        const result: TilePrototype[] = [];
        for (const def of this.baseTileDefinitions) {
            for (let rotation = 0; rotation < 6; rotation++) {
                result.push({
                    type: def.type,
                    rotation,
                    weight: def.weight,
                    edges: this.rotateEdges(def.edges, rotation),
                });
            }
        }
        return result;
    }
}