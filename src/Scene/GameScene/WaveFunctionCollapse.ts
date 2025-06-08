import { ICellRules } from "../../Data/Interfaces/IBaseSceneData";
import { GroundCellType } from "../../Data/Enums/GroundCellType";
import { EdgeType } from "../../Data/Enums/EdgeType";
import { HexCoord } from "../../Data/Interfaces/ICell";
import { HexRotation } from "../../Data/Enums/HexRotation";

interface TileVariant {
    type: GroundCellType;
    rotation: HexRotation;
    edges: EdgeType[];  // Edges in their final rotated positions
    weight: number;
}

interface Cell {
    coord: HexCoord;
    possibleTiles: Set<GroundCellType>;
    possibleRotations: Set<HexRotation>;
    possibleVariants: Set<TileVariant>;
    collapsed: boolean;
    entropy: number;
    rotation?: HexRotation;
    type?: GroundCellType;
}

interface CellResult {
    type: GroundCellType;
    rotation: HexRotation;
    position: HexCoord;
}

export class HexWFC {
    private tiles: Map<GroundCellType, ICellRules>;
    private tileVariants: TileVariant[];  // All possible tile variants
    private grid: Map<string, Cell>;
    private radius: number;
    private random: () => number;  // Random number generator

    // Direction vectors for hexagonal grid (in axial coordinates)
    private readonly NEIGHBOR_DIRECTIONS = [
        { q: 1, r: 0 },   // 0° (right)
        { q: 1, r: -1 },  // 60° (top-right)
        { q: 0, r: -1 },  // 120° (top-left)
        { q: -1, r: 0 },  // 180° (left)
        { q: -1, r: 1 },  // 240° (bottom-left)
        { q: 0, r: 1 },   // 300° (bottom-right)
    ];

    constructor(radius: number, tiles: ICellRules[], random: () => number = Math.random) {
        this.radius = radius;
        this.random = random;
        this.tiles = new Map(tiles.map(tile => [tile.type, tile]));
        this.tileVariants = this.generateTileVariants();
        this.grid = new Map();
        this.initializeGrid();
    }

    private generateTileVariants(): TileVariant[] {
        const variants: TileVariant[] = [];
        
        // For each tile type
        for (const [type, rules] of this.tiles) {
            // For each possible rotation
            for (let rotation = 0; rotation < 6; rotation++) {
                // Create rotated edges array
                const rotatedEdges = this.rotateEdges(rules.edges, rotation);
                
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
        // Rotate the edges array by the given number of positions
        const rotated = [...edges];
        for (let i = 0; i < rotation; i++) {
            rotated.unshift(rotated.pop()!);
        }
        return rotated;
    }

    private getCoordKey(coord: HexCoord): string {
        return `${coord.q},${coord.r}`;
    }

    private initializeGrid(): void {
        for (let q = -this.radius; q <= this.radius; q++) {
            const r1 = Math.max(-this.radius, -q - this.radius);
            const r2 = Math.min(this.radius, -q + this.radius);
            for (let r = r1; r <= r2; r++) {
                const coord: HexCoord = { q, r };
                const key = this.getCoordKey(coord);
                
                // Initialize cell with all possible variants
                const cell: Cell = {
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

        // console.log(this.grid);
    }

    // Helper method to get cell by coordinate
    public getCell(coord: HexCoord): Cell | undefined {
        return this.grid.get(this.getCoordKey(coord));
    }

    // Helper method to get all cells
    public getAllCells(): Cell[] {
        return Array.from(this.grid.values());
    }

    private collapseCell(cell: Cell): void {
        // Get all possible variants
        const possibleVariants = Array.from(cell.possibleVariants);
        
        // Calculate total weight
        const totalWeight = possibleVariants.reduce((sum, variant) => sum + variant.weight, 0);

        // Select a random variant based on weights
        let randomValue = this.random() * totalWeight;
        let selectedVariant = possibleVariants[0]; // Fallback

        for (const variant of possibleVariants) {
            randomValue -= variant.weight;
            if (randomValue <= 0) {
                selectedVariant = variant;
                break;
            }
        }

        // Collapse the cell to the selected variant
        cell.collapsed = true;
        cell.possibleVariants = new Set([selectedVariant]);
        cell.possibleTiles = new Set([selectedVariant.type]);
        cell.possibleRotations = new Set([selectedVariant.rotation]);
        cell.rotation = selectedVariant.rotation;
        cell.type = selectedVariant.type;
        cell.entropy = 1;
    }

    private getNeighborCoord(coord: HexCoord, direction: number): HexCoord {
        const dir = this.NEIGHBOR_DIRECTIONS[direction];
        return {
            q: coord.q + dir.q,
            r: coord.r + dir.r
        };
    }

    private getOppositeDirection(direction: number): number {
        return (direction + 3) % 6;
    }

    private propagateConstraints(cell: Cell): boolean {
        // Queue for cells that need to be checked
        const queue: Cell[] = [cell];
        const checked = new Set<string>();

        while (queue.length > 0) {
            const currentCell = queue.shift()!;
            const currentKey = this.getCoordKey(currentCell.coord);

            // Skip if already checked
            if (checked.has(currentKey)) continue;
            checked.add(currentKey);

            // Get the current cell's variant (it should be collapsed)
            const currentVariant = Array.from(currentCell.possibleVariants)[0];
            
            // Debug logging
            // console.log(`Propagating from cell at ${currentKey}:`, {
            //     type: currentVariant.type,
            //     rotation: currentVariant.rotation,
            //     edges: currentVariant.edges
            // });

            // Check each neighbor
            for (let direction = 0; direction < 6; direction++) {
                const neighborCoord = this.getNeighborCoord(currentCell.coord, direction);
                const neighborKey = this.getCoordKey(neighborCoord);
                const neighbor = this.grid.get(neighborKey);

                // Skip if neighbor doesn't exist or is already collapsed
                if (!neighbor || neighbor.collapsed) continue;

                // Get the edge that should match between current and neighbor
                const currentEdge = currentVariant.edges[direction];
                const oppositeDirection = this.getOppositeDirection(direction);

                // Debug logging
                // console.log(`  Checking neighbor at ${neighborKey} in direction ${direction}:`);
                // console.log(`    Current edge: ${currentEdge}`);
                // console.log(`    Opposite direction: ${oppositeDirection}`);
                // console.log(`    Neighbor variants before: ${neighbor.possibleVariants.size}`);

                // Filter neighbor's possible variants based on edge compatibility
                const compatibleVariants = Array.from(neighbor.possibleVariants).filter(variant => 
                    variant.edges[oppositeDirection] === currentEdge
                );

                // console.log(`    Compatible variants: ${compatibleVariants.length}`);

                // If no compatible variants, we have a contradiction
                if (compatibleVariants.length === 0) {
                    console.error(`CONTRADICTION: No compatible variants for neighbor at ${neighborKey}`);
                    return false;
                }

                // If we removed some possibilities, update the neighbor
                if (compatibleVariants.length < neighbor.possibleVariants.size) {
                    neighbor.possibleVariants = new Set(compatibleVariants);
                    neighbor.possibleTiles = new Set(compatibleVariants.map(v => v.type));
                    neighbor.possibleRotations = new Set(compatibleVariants.map(v => v.rotation));
                    neighbor.entropy = compatibleVariants.length;

                    // console.log(`    Updated neighbor variants: ${neighbor.possibleVariants.size}`);

                    // Add to queue if it has new constraints
                    queue.push(neighbor);
                }
            }
        }

        return true;
    }

    private findLowestEntropyCell(): Cell | null {
        let lowestEntropy = Infinity;
        let lowestEntropyCells: Cell[] = [];

        // Find all cells with the lowest entropy
        for (const cell of this.grid.values()) {
            if (cell.collapsed) continue;

            if (cell.entropy < lowestEntropy) {
                lowestEntropy = cell.entropy;
                lowestEntropyCells = [cell];
            } else if (cell.entropy === lowestEntropy) {
                lowestEntropyCells.push(cell);
            }
        }

        // If no cells found or all cells are collapsed
        if (lowestEntropyCells.length === 0) {
            return null;
        }

        // Randomly select one of the cells with lowest entropy
        const randomIndex = Math.floor(this.random() * lowestEntropyCells.length);
        return lowestEntropyCells[randomIndex];
    }

    public generate(): boolean {
        // Initialize grid if not already done
        if (this.grid.size === 0) {
            this.initializeGrid();
        }

        // Main WFC loop
        while (true) {
            // Find cell with lowest entropy
            const cell = this.findLowestEntropyCell();
            
            // If no cell found, we're done
            if (!cell) {
                return true; // Successfully generated
            }

            // If cell has no possible states, we failed
            if (cell.entropy === 0) {
                return false; // Failed to generate
            }

            // Collapse the cell
            this.collapseCell(cell);

            // Propagate constraints
            const success = this.propagateConstraints(cell);
            if (!success) {
                return false; // Failed to propagate constraints
            }
        }
    }

    public getGrid(): CellResult[] {
        const results: CellResult[] = [];
        
        for (const cell of this.grid.values()) {
            if (!cell.collapsed) continue;
            
            // Get the single variant that this cell collapsed to
            const variant = Array.from(cell.possibleVariants)[0];
            
            results.push({
                type: variant.type,
                rotation: variant.rotation,
                position: cell.coord
            });
        }
        
        return results;
    }
}