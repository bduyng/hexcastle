import { IHexCoord } from "../../../Data/Interfaces/IHexTile";
import { HexTileType } from "../../../Data/Enums/HexTileType";
import { TileEdgeType } from "../../../Data/Enums/TileEdgeType";
import { HexTilesRulesConfig } from "../../../Data/Configs/HexTilesRulesConfig";
import { IHexTilesRule } from "../../../Data/Interfaces/IBaseSceneData";
import { HexRotation } from "../../../Data/Enums/HexRotation";
import { ITileVariant } from "../../../Data/Interfaces/IWFC";

export interface IWallTile {
    coord: IHexCoord;
    type: HexTileType;
    rotation: HexRotation;
}

export interface IWallTileVariant {
    type: HexTileType;
    rotation: HexRotation;
    edges: TileEdgeType[];
}

export interface IWallShape {
    center: IHexCoord;
    radius: number;
    maxOffset: number;
}

export interface IWallGenerationResult {
    wallTiles: IWallTile[];
    insideTiles: IHexCoord[];
    outsideAdjacentTiles: IHexCoord[];
}

export class WallGenerator {
    
    private static wallTileVariants: IWallTileVariant[] = [];
    
    public static generateRandomClosedWall(shape: IWallShape): IWallTile[] {
        // Инициализируем варианты тайлов стен при первом вызове
        if (this.wallTileVariants.length === 0) {
            this.initializeWallTileVariants();
        }
        
        const wallTiles: IWallTile[] = [];
        
        const baseRing = this.generateHexRing(shape.center, shape.radius);
        const offsetRing = this.applyOffsetToRing(baseRing, shape.maxOffset);
        
        const wallCoords = offsetRing.map(coord => ({ coord }));
        
        // Создаем временные тайлы стены для определения внутренних и внешних тайлов
        const tempWallTiles: IWallTile[] = wallCoords.map(wc => ({
            coord: wc.coord,
            type: HexTileType.WallStraight,
            rotation: HexRotation.Rotate0
        }));
        
        // Сначала определяем внутренние и внешние тайлы для более точной ориентации
        const insideTiles = this.findTilesInsideWall(tempWallTiles, shape.center);
        const outsideAdjacentTiles = this.findOutsideAdjacentTiles(tempWallTiles, insideTiles);
        
        for (let i = 0; i < wallCoords.length; i++) {
            const wallTile = wallCoords[i];
            const tileVariant = this.determineWallTileType(wallTile.coord, wallCoords, i, insideTiles, outsideAdjacentTiles);
            wallTiles.push({ 
                coord: wallTile.coord, 
                type: tileVariant.type, 
                rotation: tileVariant.rotation 
            });
        }
        
        return wallTiles;
    }
    
    private static initializeWallTileVariants(): void {
        this.wallTileVariants = [];
        
        // Получаем все типы тайлов стен
        const wallTileTypes = [
            // HexTileType.WallCornerAGate,
            HexTileType.WallCornerAInside,
            HexTileType.WallCornerAOutside,
            HexTileType.WallCornerBInside,
            HexTileType.WallCornerBOutside,
            HexTileType.WallStraight,
            // HexTileType.WallStraightGate,
        ];
        
        // Для каждого типа тайла создаем все варианты поворотов
        for (const tileType of wallTileTypes) {
            const tileRule = HexTilesRulesConfig.find(rule => rule.type === tileType);
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

    private static rotateEdges(edges: TileEdgeType[], rotation: number): TileEdgeType[] {
        const rotated = [...edges];
        for (let i = 0; i < rotation; i++) {
            rotated.unshift(rotated.pop()!);
        }

        return rotated;
    }
    
    private static applyOffsetToRing(ring: IHexCoord[], maxOffset: number): IHexCoord[] {
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
    
    private static calculateRingCenter(ring: IHexCoord[]): IHexCoord {
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
    
    private static fixRingConnectivity(ring: IHexCoord[]): IHexCoord[] {
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
    
    private static getPathBetweenPoints(start: IHexCoord, end: IHexCoord): IHexCoord[] {
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
    
    private static generateHexRing(center: IHexCoord, radius: number): IHexCoord[] {
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
    
    private static getHexDistance(coord1: IHexCoord, coord2: IHexCoord): number {
        const dq = coord1.q - coord2.q;
        const dr = coord1.r - coord2.r;
        const ds = -dq - dr;
        
        return Math.max(Math.abs(dq), Math.abs(dr), Math.abs(ds));
    }
    
    private static determineWallTileType(coord: IHexCoord, wallCoords: { coord: IHexCoord }[], currentIndex: number, insideTiles: IHexCoord[], outsideAdjacentTiles: IHexCoord[]): IWallTileVariant {
        // Получаем предыдущий и следующий тайлы в цепочке стены
        const prevIndex = (currentIndex - 1 + wallCoords.length) % wallCoords.length;
        const nextIndex = (currentIndex + 1) % wallCoords.length;
        
        const prevCoord = wallCoords[prevIndex].coord;
        const nextCoord = wallCoords[nextIndex].coord;
        
        // Направления соседей в гексагональной сетке (0°, 60°, 120°, 180°, 240°, 300°)
        const neighborDirections = [
            { q: 1, r: 0 },   // 0°
            { q: 1, r: -1 },  // 60°
            { q: 0, r: -1 },  // 120°
            { q: -1, r: 0 },  // 180°
            { q: -1, r: 1 },  // 240°
            { q: 0, r: 1 },   // 300°
        ];

        // Определяем направления к предыдущему и следующему тайлам
        let prevDirection = -1;
        let nextDirection = -1;
        
        for (let i = 0; i < neighborDirections.length; i++) {
            const neighborCoord = {
                q: coord.q + neighborDirections[i].q,
                r: coord.r + neighborDirections[i].r
            };
            
            if (neighborCoord.q === prevCoord.q && neighborCoord.r === prevCoord.r) {
                prevDirection = i;
            }
            
            if (neighborCoord.q === nextCoord.q && neighborCoord.r === nextCoord.r) {
                nextDirection = i;
            }
        }

        // Определяем, какие стороны должны быть стенами
        const requiredWallEdges: boolean[] = [false, false, false, false, false, false];
        
        // Если есть сосед в определенном направлении, то там должна быть стена
        if (prevDirection !== -1) {
            requiredWallEdges[prevDirection] = true;
        }
        
        if (nextDirection !== -1) {
            requiredWallEdges[nextDirection] = true;
        }

        // Определяем, какие стороны должны быть Inside/Outside
        const requiredInsideEdges: boolean[] = [false, false, false, false, false, false];
        const requiredOutsideEdges: boolean[] = [false, false, false, false, false, false];
        
        // Для каждой стороны проверяем, что находится за ней
        for (let i = 0; i < 6; i++) {
            if (!requiredWallEdges[i]) { // Если это не стена
                const neighborCoord = {
                    q: coord.q + neighborDirections[i].q,
                    r: coord.r + neighborDirections[i].r
                };
                
                // Проверяем, является ли сосед частью стены
                const isWallNeighbor = wallCoords.some(wallCoord => 
                    wallCoord.coord.q === neighborCoord.q && wallCoord.coord.r === neighborCoord.r
                );
                
                if (!isWallNeighbor) {
                    // Проверяем, находится ли сосед среди внутренних тайлов
                    const isInsideTile = insideTiles.some(insideTile => 
                        insideTile.q === neighborCoord.q && insideTile.r === neighborCoord.r
                    );
                    
                    // Проверяем, находится ли сосед среди внешних прилегающих тайлов
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

        // Ищем подходящий вариант тайла среди всех поворотов
        for (const variant of this.wallTileVariants) {
            let isCompatible = true;
            
            // Проверяем каждую сторону
            for (let i = 0; i < 6; i++) {
                const requiredWall = requiredWallEdges[i];
                const requiredInside = requiredInsideEdges[i];
                const requiredOutside = requiredOutsideEdges[i];
                const tileEdge = variant.edges[i];
                
                // Если требуется стена, но у тайла на этой стороне не стена
                if (requiredWall && tileEdge !== TileEdgeType.Wall) {
                    isCompatible = false;
                    break;
                }
                
                // Если не требуется стена, но у тайла на этой стороне стена
                if (!requiredWall && tileEdge === TileEdgeType.Wall) {
                    isCompatible = false;
                    break;
                }
                
                // Если требуется Inside, но у тайла на этой стороне не Inside
                if (requiredInside && tileEdge !== TileEdgeType.Inside) {
                    isCompatible = false;
                    break;
                }
                
                // Если требуется Outside, но у тайла на этой стороне не Outside
                if (requiredOutside && tileEdge !== TileEdgeType.Outside) {
                    isCompatible = false;
                    break;
                }
            }
            
            if (isCompatible) {
                return variant;
            }
        }

        // Если не найден подходящий тайл, возвращаем прямой тайл стены как fallback
        const fallbackVariant = this.wallTileVariants.find(variant => variant.type === HexTileType.WallStraight && variant.rotation === HexRotation.Rotate0);
        return fallbackVariant || this.wallTileVariants[0];
    }

    /**
     * Находит все гексагональные тайлы, которые находятся внутри стены
     * @param wallTiles массив тайлов стены
     * @param center центр области
     * @returns массив координат тайлов внутри стены
     */
    public static findTilesInsideWall(wallTiles: IWallTile[], center: IHexCoord): IHexCoord[] {
        // Создаем множество координат стены для быстрого поиска
        const wallCoordsSet = new Set<string>();
        for (const wallTile of wallTiles) {
            wallCoordsSet.add(`${wallTile.coord.q},${wallTile.coord.r}`);
        }

        // Находим границы области для ограничения поиска
        const bounds = this.calculateBounds(wallTiles);
        
        // Используем flood fill алгоритм для поиска внутренних тайлов
        const insideTiles: IHexCoord[] = [];
        const visited = new Set<string>();
        
        // Начинаем с центра
        const queue: IHexCoord[] = [center];
        
        while (queue.length > 0) {
            const current = queue.shift()!;
            const key = `${current.q},${current.r}`;
            
            // Пропускаем уже посещенные тайлы
            if (visited.has(key)) {
                continue;
            }
            
            visited.add(key);
            
            // Если текущий тайл не является стеной, добавляем его в результат
            if (!wallCoordsSet.has(key)) {
                insideTiles.push(current);
                
                // Добавляем соседние тайлы в очередь
                const neighbors = this.getHexNeighbors(current);
                for (const neighbor of neighbors) {
                    const neighborKey = `${neighbor.q},${neighbor.r}`;
                    
                    // Проверяем, что сосед в пределах границ и еще не посещен
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

    /**
     * Вычисляет границы области, ограниченной стеной
     */
    private static calculateBounds(wallTiles: IWallTile[]): { minQ: number, maxQ: number, minR: number, maxR: number } {
        if (wallTiles.length === 0) {
            return { minQ: 0, maxQ: 0, minR: 0, maxR: 0 };
        }
        
        let minQ = wallTiles[0].coord.q;
        let maxQ = wallTiles[0].coord.q;
        let minR = wallTiles[0].coord.r;
        let maxR = wallTiles[0].coord.r;
        
        for (const wallTile of wallTiles) {
            minQ = Math.min(minQ, wallTile.coord.q);
            maxQ = Math.max(maxQ, wallTile.coord.q);
            minR = Math.min(minR, wallTile.coord.r);
            maxR = Math.max(maxR, wallTile.coord.r);
        }
        
        return { minQ, maxQ, minR, maxR };
    }

    /**
     * Проверяет, находится ли координата в пределах границ
     */
    private static isWithinBounds(coord: IHexCoord, bounds: { minQ: number, maxQ: number, minR: number, maxR: number }): boolean {
        return coord.q >= bounds.minQ && coord.q <= bounds.maxQ && 
               coord.r >= bounds.minR && coord.r <= bounds.maxR;
    }

    /**
     * Возвращает всех соседей гексагонального тайла
     */
    private static getHexNeighbors(coord: IHexCoord): IHexCoord[] {
        return [
            { q: coord.q + 1, r: coord.r },     // 0°
            { q: coord.q + 1, r: coord.r - 1 }, // 60°
            { q: coord.q, r: coord.r - 1 },     // 120°
            { q: coord.q - 1, r: coord.r },     // 180°
            { q: coord.q - 1, r: coord.r + 1 }, // 240°
            { q: coord.q, r: coord.r + 1 },     // 300°
        ];
    }

    /**
     * Находит все внешние прилегающие тайлы к стене
     * @param wallTiles массив тайлов стены
     * @param insideTiles массив тайлов внутри стены
     * @returns массив координат внешних прилегающих тайлов
     */
    public static findOutsideAdjacentTiles(wallTiles: IWallTile[], insideTiles: IHexCoord[]): IHexCoord[] {
        // Создаем множества для быстрого поиска
        const wallCoordsSet = new Set<string>();
        const insideCoordsSet = new Set<string>();
        
        for (const wallTile of wallTiles) {
            wallCoordsSet.add(`${wallTile.coord.q},${wallTile.coord.r}`);
        }
        
        for (const insideTile of insideTiles) {
            insideCoordsSet.add(`${insideTile.q},${insideTile.r}`);
        }
        
        // Находим границы области для ограничения поиска
        const bounds = this.calculateBounds(wallTiles);
        
        // Множество для хранения внешних прилегающих тайлов
        const outsideAdjacentTiles = new Set<string>();
        
        // Для каждого тайла стены проверяем всех соседей
        for (const wallTile of wallTiles) {
            const neighbors = this.getHexNeighbors(wallTile.coord);
            
            for (const neighbor of neighbors) {
                const neighborKey = `${neighbor.q},${neighbor.r}`;
                
                // Если сосед не является стеной и не находится внутри стены
                if (!wallCoordsSet.has(neighborKey) && !insideCoordsSet.has(neighborKey)) {
                    // Проверяем, что сосед в пределах расширенных границ
                    if (this.isWithinExtendedBounds(neighbor, bounds)) {
                        outsideAdjacentTiles.add(neighborKey);
                    }
                }
            }
        }
        
        // Преобразуем обратно в массив координат
        return Array.from(outsideAdjacentTiles).map(key => {
            const [q, r] = key.split(',').map(Number);
            return { q, r };
        });
    }

    /**
     * Проверяет, находится ли координата в пределах расширенных границ
     * (с небольшим запасом для внешних тайлов)
     */
    private static isWithinExtendedBounds(coord: IHexCoord, bounds: { minQ: number, maxQ: number, minR: number, maxR: number }): boolean {
        const margin = 2; // Небольшой запас для внешних тайлов
        return coord.q >= bounds.minQ - margin && coord.q <= bounds.maxQ + margin && 
               coord.r >= bounds.minR - margin && coord.r <= bounds.maxR + margin;
    }

    /**
     * Генерирует стену и находит все тайлы внутри неё
     * @param shape параметры формы стены
     * @returns объект с тайлами стены и внутренними тайлами
     */
    public static generateWallWithInsideTiles(shape: IWallShape): IWallGenerationResult {
        const wallTiles = this.generateRandomClosedWall(shape);
        const insideTiles = this.findTilesInsideWall(wallTiles, shape.center);
        const outsideAdjacentTiles = this.findOutsideAdjacentTiles(wallTiles, insideTiles);
        
        return {
            wallTiles,
            insideTiles,
            outsideAdjacentTiles
        };
    }
} 