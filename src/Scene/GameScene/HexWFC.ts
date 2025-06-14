import { IHexTilesRule } from "../../Data/Interfaces/IBaseSceneData";
import { HexTileType } from "../../Data/Enums/HexTileType";
import { TileEdgeType } from "../../Data/Enums/TileEdgeType";
import { IHexCoord } from "../../Data/Interfaces/IHexTile";
import { HexRotation } from "../../Data/Enums/HexRotation";
import { IWFCHexTilesInfo, IHexTilesResult, ITileVariant, IWFCConfig } from "../../Data/Interfaces/IWFC";
import { NeighborDirections } from "../../Data/Configs/WFCConfig";
import { HexTilesRulesConfig } from "../../Data/Configs/HexTilesRulesConfig";

export class HexWFC {
    private tiles: Map<HexTileType, IHexTilesRule>;
    private tileRules: IHexTilesRule[];
    private tileVariants: ITileVariant[];
    private grid: Map<string, IWFCHexTilesInfo>;
    private config: IWFCConfig;

    constructor(config: IWFCConfig) {
        this.config = config;
        this.init();
    }

    public generate(): boolean {
        const centerTile = this.grid.get(this.getCoordKey({ q: 0, r: 0 }));
        if (!centerTile) {
            console.error('Center tile not found');
            return false;
        }

        if (this.config.startTile) {
            let variants = this.tileVariants.filter(v => v.type === this.config.startTile.type);
            
            if (this.config.startTile.rotation !== undefined) {
                variants = variants.filter(v => v.rotation === this.config.startTile.rotation);
            }
            
            if (variants.length === 0) {
                console.error(`No variants found for start tile type ${this.config.startTile.type}${this.config.startTile.rotation !== undefined ? ` with rotation ${this.config.startTile.rotation}` : ''}`);
                return false;
            }
            
            const selectedVariant = variants[Math.floor(Math.random() * variants.length)];
            
            centerTile.collapsed = true;
            centerTile.possibleVariants = new Set<ITileVariant>([selectedVariant]);
            centerTile.possibleTiles = new Set<HexTileType>([selectedVariant.type]);
            centerTile.possibleRotations = new Set<HexRotation>([selectedVariant.rotation]);
            centerTile.rotation = selectedVariant.rotation;
            centerTile.type = selectedVariant.type;
            centerTile.entropy = 1;
        } else {
            this.collapseHexTile(centerTile);
        }

        const success = this.propagateConstraints(centerTile);
        if (!success) {
            return false;
        }

        while (true) {
            const hexTile: IWFCHexTilesInfo = this.findLowestEntropyHexTile();

            if (!hexTile) {
                return true;
            }

            if (hexTile.entropy === 0) {
                return false;
            }

            this.collapseHexTile(hexTile);

            const success: boolean = this.propagateConstraints(hexTile);
            if (!success) {
                return false;
            }
        }
    }

    public getGrid(): IHexTilesResult[] {
        const results: IHexTilesResult[] = [];

        for (const hexTile of this.grid.values()) {
            if (!hexTile.collapsed) continue;

            const variant: ITileVariant = Array.from(hexTile.possibleVariants)[0];

            results.push({
                type: variant.type,
                rotation: variant.rotation,
                position: hexTile.coord,
            });
        }

        return results;
    }

    public getHexTile(coord: IHexCoord): IWFCHexTilesInfo | undefined {
        return this.grid.get(this.getCoordKey(coord));
    }

    public getAllHexTiles(): IWFCHexTilesInfo[] {
        return Array.from(this.grid.values());
    }

    private init(): void {
        this.tileRules = HexTilesRulesConfig.filter(tile => this.config.hexTileTypesUsed.includes(tile.type));

        this.tiles = new Map(this.tileRules.map(tile => [tile.type, tile]));
        this.tileVariants = this.generateTileVariants();

        this.grid = new Map();
        this.initializeGrid();
    }

    private generateTileVariants(): ITileVariant[] {
        const variants: ITileVariant[] = [];

        for (const [type, rules] of this.tiles) {
            for (let rotation = 0; rotation < 6; rotation++) {
                const rotatedEdges: TileEdgeType[] = this.rotateEdges(rules.edges, rotation);

                variants.push({
                    type,
                    rotation: rotation as HexRotation,
                    edges: rotatedEdges,
                    weight: rules.weight
                });
            }
        }

        return variants;
    }

    private rotateEdges(edges: TileEdgeType[], rotation: number): TileEdgeType[] {
        const rotated = [...edges];
        for (let i = 0; i < rotation; i++) {
            rotated.unshift(rotated.pop()!);
        }

        return rotated;
    }

    private getCoordKey(coord: IHexCoord): string {
        return `${coord.q},${coord.r}`;
    }

    private initializeGrid(): void {
        for (let q = -this.config.radius; q <= this.config.radius; q++) {
            const r1 = Math.max(-this.config.radius, -q - this.config.radius);
            const r2 = Math.min(this.config.radius, -q + this.config.radius);
            for (let r = r1; r <= r2; r++) {
                const coord: IHexCoord = { q, r };
                const key: string = this.getCoordKey(coord);

                const WFCHexTileInfo: IWFCHexTilesInfo = {
                    coord,
                    possibleTiles: new Set(this.tileVariants.map(v => v.type)),
                    possibleRotations: new Set(this.tileVariants.map(v => v.rotation)),
                    possibleVariants: new Set(this.tileVariants),
                    collapsed: false,
                    entropy: this.tileVariants.length,
                };

                this.grid.set(key, WFCHexTileInfo);
            }
        }
    }

    private collapseHexTile(hexTile: IWFCHexTilesInfo): void {
        const possibleVariants: ITileVariant[] = Array.from(hexTile.possibleVariants);
        const totalWeight: number = possibleVariants.reduce((sum: number, variant: ITileVariant) => sum + variant.weight, 0);

        let randomValue: number = Math.random() * totalWeight;
        let selectedVariant: ITileVariant = possibleVariants[0];

        for (const variant of possibleVariants) {
            randomValue -= variant.weight;
            if (randomValue <= 0) {
                selectedVariant = variant;
                break;
            }
        }

        hexTile.collapsed = true;
        hexTile.possibleVariants = new Set<ITileVariant>([selectedVariant]);
        hexTile.possibleTiles = new Set<HexTileType>([selectedVariant.type]);
        hexTile.possibleRotations = new Set<HexRotation>([selectedVariant.rotation]);
        hexTile.rotation = selectedVariant.rotation;
        hexTile.type = selectedVariant.type;
        hexTile.entropy = 1;
    }

    private getNeighborCoord(coord: IHexCoord, direction: number): IHexCoord {
        const neighborDirection = NeighborDirections[direction];
        return {
            q: coord.q + neighborDirection.q,
            r: coord.r + neighborDirection.r
        };
    }

    private getOppositeDirection(direction: number): number {
        return (direction + 3) % 6;
    }

    private propagateConstraints(hexTile: IWFCHexTilesInfo): boolean {
        const queue: IWFCHexTilesInfo[] = [hexTile];
        const checked = new Set<string>();

        while (queue.length > 0) {
            const currentHexTile = queue.shift()!;
            const currentKey = this.getCoordKey(currentHexTile.coord);

            if (checked.has(currentKey))
                continue;

            checked.add(currentKey);

            const currentVariant = Array.from(currentHexTile.possibleVariants)[0];

            for (let direction = 0; direction < 6; direction++) {
                const neighborCoord = this.getNeighborCoord(currentHexTile.coord, direction);
                const neighborKey = this.getCoordKey(neighborCoord);
                const neighbor = this.grid.get(neighborKey);

                if (!neighbor || neighbor.collapsed)
                    continue;

                const currentEdge = currentVariant.edges[direction];
                const oppositeDirection = this.getOppositeDirection(direction);

                const compatibleVariants = Array.from(neighbor.possibleVariants).filter(variant =>
                    variant.edges[oppositeDirection] === currentEdge
                );

                if (compatibleVariants.length === 0) {
                    console.error(`CONTRADICTION: No compatible variants for neighbor at ${neighborKey}`);
                    return false;
                }

                if (compatibleVariants.length < neighbor.possibleVariants.size) {
                    neighbor.possibleVariants = new Set(compatibleVariants);
                    neighbor.possibleTiles = new Set(compatibleVariants.map(v => v.type));
                    neighbor.possibleRotations = new Set(compatibleVariants.map(v => v.rotation));
                    neighbor.entropy = compatibleVariants.length;

                    queue.push(neighbor);
                }
            }
        }

        return true;
    }

    private findLowestEntropyHexTile(): IWFCHexTilesInfo | null {
        let lowestEntropy = Infinity;
        let lowestEntropyTile: IWFCHexTilesInfo[] = [];

        for (const tile of this.grid.values()) {
            if (tile.collapsed) continue;

            if (tile.entropy < lowestEntropy) {
                lowestEntropy = tile.entropy;
                lowestEntropyTile = [tile];
            } else if (tile.entropy === lowestEntropy) {
                lowestEntropyTile.push(tile);
            }
        }

        if (lowestEntropyTile.length === 0) {
            return null;
        }

        const randomIndex = Math.floor(Math.random() * lowestEntropyTile.length);
        return lowestEntropyTile[randomIndex];
    }
}
