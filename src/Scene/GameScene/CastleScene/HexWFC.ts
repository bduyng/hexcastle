import { IHexTilesRule } from "../../../Data/Interfaces/IBaseSceneData";
import { HexTileType } from "../../../Data/Enums/HexTileType";
import { TileEdgeType } from "../../../Data/Enums/TileEdgeType";
import { IHexCoord } from "../../../Data/Interfaces/IHexTile";
import { HexRotation } from "../../../Data/Enums/HexRotation";
import { IWFCHexTilesInfo, IHexTilesResult, ITileVariant, IWFCConfig, INewTileStep, IWFCProgressCallback, IWFCAsyncResult } from "../../../Data/Interfaces/IWFC";
import { NeighborDirections } from "../../../Data/Configs/WFCConfig";
import { LandscapeTilesRulesConfig } from "../../../Data/Configs/LandscapeTilesRulesConfig";

export class HexWFC {
    private tiles: Map<HexTileType, IHexTilesRule>;
    private tileRules: IHexTilesRule[];
    private tileVariants: ITileVariant[];
    private grid: Map<string, IWFCHexTilesInfo>;
    private config: IWFCConfig;
    private steps: INewTileStep[] = [];
    private isGenerating: boolean = false;
    private shouldStop: boolean = false;

    constructor() {

    }

    public setConfig(config: IWFCConfig): void {
        this.config = config;
        this.init();
    }

    public generate(): boolean {
        this.steps = [];
        this.shouldStop = false;

        if (this.config.predefinedTiles && !this.initializePredefinedTiles()) {
            return false;
        }

        const initialStep = {
            landscapeFreeCells: this.getFreeCellsInfo()
        };
        this.steps.push(initialStep);

        let stepIndex = 1;
        while (true) {
            const hexTile: IWFCHexTilesInfo = this.findLowestEntropyHexTile();

            if (!hexTile) {
                return true;
            }

            if (hexTile.entropy === 0) {
                hexTile.collapsed = true;
                hexTile.entropy = 0;
                continue;
            }

            const selectedVariant = this.collapseHexTile(hexTile);

            const success: boolean = this.propagateConstraints(hexTile);
            if (!success) {
                hexTile.collapsed = false;
                hexTile.entropy = 0;
                continue;
            }

            this.steps.push({
                tile: {
                    position: hexTile.coord,
                    type: selectedVariant.type,
                    rotation: selectedVariant.rotation
                },
                landscapeFreeCells: this.getFreeCellsInfo()
            });

            stepIndex++;
        }
    }

    public async generateAsync(progressCallback?: IWFCProgressCallback, stepsPerFrame: number = 10): Promise<IWFCAsyncResult> {
        if (this.isGenerating) {
            return { success: false, error: "Generation already in progress" };
        }

        this.isGenerating = true;
        this.shouldStop = false;
        this.steps = [];

        try {
            if (this.config.predefinedTiles && !this.initializePredefinedTiles()) {
                return { success: false, error: "Failed to initialize predefined tiles" };
            }

            const initialStep = {
                landscapeFreeCells: this.getFreeCellsInfo()
            };
            this.steps.push(initialStep);

            if (progressCallback) {
                progressCallback(0);
            }

            let stepIndex = 1;
            let stepsInCurrentFrame = 0;

            while (true) {
                if (this.shouldStop) {
                    return { success: false, error: "Generation was stopped" };
                }

                const hexTile: IWFCHexTilesInfo = this.findLowestEntropyHexTile();

                if (!hexTile) {
                    const result = this.getTiles();
                    return {
                        success: true,
                        grid: result,
                        steps: this.steps
                    };
                }

                if (hexTile.entropy === 0) {
                    hexTile.collapsed = true;
                    hexTile.entropy = 0;
                    continue;
                }

                const selectedVariant = this.collapseHexTile(hexTile);

                const success: boolean = this.propagateConstraints(hexTile);
                if (!success) {
                    hexTile.collapsed = false;
                    hexTile.entropy = 0;
                    this.steps.pop();
                    continue;
                }

                const newStep = {
                    tile: {
                        position: hexTile.coord,
                        type: selectedVariant.type,
                        rotation: selectedVariant.rotation
                    },
                    landscapeFreeCells: this.getFreeCellsInfo()
                };

                this.steps.push(newStep);

                if (progressCallback) {
                    progressCallback(stepIndex);
                }

                stepIndex++;
                stepsInCurrentFrame++;

                if (stepsInCurrentFrame >= stepsPerFrame) {
                    await this.yieldToMainThread();
                    stepsInCurrentFrame = 0;
                }
            }
        } finally {
            this.isGenerating = false;
        }
    }

    public stopGeneration(): void {
        this.shouldStop = true;
    }

    public isGeneratingInProgress(): boolean {
        return this.isGenerating;
    }

    public getSteps(): INewTileStep[] {
        return this.steps;
    }

    public getTiles(): IHexTilesResult[] {
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

    public reset(): void {
        this.grid.clear();
        this.steps = [];
        this.tileRules = [];
        this.tiles.clear();
        this.tileVariants = [];
    }

    private yieldToMainThread(): Promise<void> {
        return new Promise(resolve => {
            setTimeout(resolve, 0);
        });
    }


    private init(): void {
        this.tileRules = LandscapeTilesRulesConfig.filter(tile => this.config.hexTileTypesUsed.includes(tile.type));

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

    private collapseHexTile(hexTile: IWFCHexTilesInfo): ITileVariant {
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

        return selectedVariant;
    }

    private getFreeCellsInfo(): { position: IHexCoord; entropy: number; possibleVariants: ITileVariant[] }[] {
        const freeCells: { position: IHexCoord; entropy: number; possibleVariants: ITileVariant[] }[] = [];

        for (const tile of this.grid.values()) {
            if (!tile.collapsed) {
                const possibleVariants = Array.from(tile.possibleVariants);
                const entropy = possibleVariants.length;

                freeCells.push({
                    position: { ...tile.coord },
                    entropy: entropy,
                    possibleVariants: [...possibleVariants]
                });
            }
        }

        return freeCells;
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

            // Проверяем все соседние ячейки для текущей
            for (let direction = 0; direction < 6; direction++) {
                const neighborCoord = this.getNeighborCoord(currentHexTile.coord, direction);
                const neighborKey = this.getCoordKey(neighborCoord);
                const neighbor = this.grid.get(neighborKey);

                if (!neighbor || neighbor.collapsed)
                    continue;

                // Получаем все возможные варианты для текущей ячейки
                const currentVariants = Array.from(currentHexTile.possibleVariants);
                const oppositeDirection = this.getOppositeDirection(direction);

                // Собираем все возможные ребра, которые могут быть у текущей ячейки
                const possibleEdges = new Set(currentVariants.map(v => v.edges[direction]));

                // Фильтруем варианты соседа, оставляя только те, которые совместимы хотя бы с одним вариантом текущей ячейки
                const compatibleVariants = Array.from(neighbor.possibleVariants).filter(variant => {
                    const neighborEdge = variant.edges[oppositeDirection];
                    return possibleEdges.has(neighborEdge);
                });

                if (compatibleVariants.length === 0) {
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

    private initializePredefinedTiles(): boolean {
        if (!this.config.predefinedTiles) {
            return true;
        }

        const placedTiles: IWFCHexTilesInfo[] = [];

        for (const predefinedTile of this.config.predefinedTiles) {
            const tile = this.grid.get(this.getCoordKey(predefinedTile.coord));
            if (!tile) {
                console.error(`Predefined tile position ${predefinedTile.coord.q},${predefinedTile.coord.r} is out of bounds`);
                return false;
            }

            const variants = this.tileVariants.filter(v =>
                v.type === predefinedTile.type &&
                v.rotation === predefinedTile.rotation
            );

            if (variants.length === 0) {
                console.error(`No variants found for predefined tile type ${predefinedTile.type} with rotation ${predefinedTile.rotation}`);
                return false;
            }

            const selectedVariant = variants[0];

            tile.collapsed = true;
            tile.possibleVariants = new Set<ITileVariant>([selectedVariant]);
            tile.possibleTiles = new Set<HexTileType>([selectedVariant.type]);
            tile.possibleRotations = new Set<HexRotation>([selectedVariant.rotation]);
            tile.rotation = selectedVariant.rotation;
            tile.type = selectedVariant.type;
            tile.entropy = 1;

            placedTiles.push(tile);
        }

        for (const tile of placedTiles) {
            const success = this.propagateConstraints(tile);
            if (!success) {
                console.error(`Failed to propagate constraints from predefined tile at ${tile.coord.q},${tile.coord.r}`);
                return false;
            }
        }

        return true;
    }
}
