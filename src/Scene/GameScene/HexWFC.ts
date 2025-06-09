import { ICellRules } from "../../Data/Interfaces/IBaseSceneData";
import { GroundCellType } from "../../Data/Enums/GroundCellType";
import { EdgeType } from "../../Data/Enums/EdgeType";
import { IHexCoord } from "../../Data/Interfaces/ICell";
import { HexRotation } from "../../Data/Enums/HexRotation";
import { IWFCCellInfo, ICellResult, ITileVariant } from "../../Data/Interfaces/IWFC";
import { NeighborDirections } from "../../Data/Configs/WFCConfig";

export class HexWFC {
    private tiles: Map<GroundCellType, ICellRules>;
    private tileRules: ICellRules[];
    private tileVariants: ITileVariant[];
    private grid: Map<string, IWFCCellInfo>;
    private radius: number;

    constructor(radius: number, tiles: ICellRules[]) {
        this.radius = radius;
        this.tileRules = tiles;

        this.init();
    }

    public generate(): boolean {
        while (true) {
            const cell: IWFCCellInfo = this.findLowestEntropyCell();

            if (!cell) {
                return true;
            }

            if (cell.entropy === 0) {
                return false;
            }

            this.collapseCell(cell);

            const success: boolean = this.propagateConstraints(cell);
            if (!success) {
                return false;
            }
        }
    }

    public getGrid(): ICellResult[] {
        const results: ICellResult[] = [];

        for (const cell of this.grid.values()) {
            if (!cell.collapsed) continue;

            const variant: ITileVariant = Array.from(cell.possibleVariants)[0];

            results.push({
                type: variant.type,
                rotation: variant.rotation,
                position: cell.coord,
            });
        }

        return results;
    }

    public getCell(coord: IHexCoord): IWFCCellInfo | undefined {
        return this.grid.get(this.getCoordKey(coord));
    }

    public getAllCells(): IWFCCellInfo[] {
        return Array.from(this.grid.values());
    }

    private init(): void {
        this.tiles = new Map(this.tileRules.map(tile => [tile.type, tile]));
        this.tileVariants = this.generateTileVariants();

        this.grid = new Map();
        this.initializeGrid();
    }

    private generateTileVariants(): ITileVariant[] {
        const variants: ITileVariant[] = [];

        for (const [type, rules] of this.tiles) {
            for (let rotation = 0; rotation < 6; rotation++) {
                const rotatedEdges: EdgeType[] = this.rotateEdges(rules.edges, rotation);

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

    private rotateEdges(edges: EdgeType[], rotation: number): EdgeType[] {
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
        for (let q = -this.radius; q <= this.radius; q++) {
            const r1 = Math.max(-this.radius, -q - this.radius);
            const r2 = Math.min(this.radius, -q + this.radius);
            for (let r = r1; r <= r2; r++) {
                const coord: IHexCoord = { q, r };
                const key: string = this.getCoordKey(coord);

                const cell: IWFCCellInfo = {
                    coord,
                    possibleTiles: new Set(this.tileVariants.map(v => v.type)),
                    possibleRotations: new Set(this.tileVariants.map(v => v.rotation)),
                    possibleVariants: new Set(this.tileVariants),
                    collapsed: false,
                    entropy: this.tileVariants.length,
                };

                this.grid.set(key, cell);
            }
        }
    }

    private collapseCell(cell: IWFCCellInfo): void {
        const possibleVariants: ITileVariant[] = Array.from(cell.possibleVariants);
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

        cell.collapsed = true;
        cell.possibleVariants = new Set<ITileVariant>([selectedVariant]);
        cell.possibleTiles = new Set<GroundCellType>([selectedVariant.type]);
        cell.possibleRotations = new Set<HexRotation>([selectedVariant.rotation]);
        cell.rotation = selectedVariant.rotation;
        cell.type = selectedVariant.type;
        cell.entropy = 1;
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

    private propagateConstraints(cell: IWFCCellInfo): boolean {
        const queue: IWFCCellInfo[] = [cell];
        const checked = new Set<string>();

        while (queue.length > 0) {
            const currentCell = queue.shift()!;
            const currentKey = this.getCoordKey(currentCell.coord);

            if (checked.has(currentKey))
                continue;

            checked.add(currentKey);

            const currentVariant = Array.from(currentCell.possibleVariants)[0];

            for (let direction = 0; direction < 6; direction++) {
                const neighborCoord = this.getNeighborCoord(currentCell.coord, direction);
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

    private findLowestEntropyCell(): IWFCCellInfo | null {
        let lowestEntropy = Infinity;
        let lowestEntropyCells: IWFCCellInfo[] = [];

        for (const cell of this.grid.values()) {
            if (cell.collapsed) continue;

            if (cell.entropy < lowestEntropy) {
                lowestEntropy = cell.entropy;
                lowestEntropyCells = [cell];
            } else if (cell.entropy === lowestEntropy) {
                lowestEntropyCells.push(cell);
            }
        }

        if (lowestEntropyCells.length === 0) {
            return null;
        }

        const randomIndex = Math.floor(Math.random() * lowestEntropyCells.length);
        return lowestEntropyCells[randomIndex];
    }
}
