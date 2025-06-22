import { IHexCoord } from "../../../Data/Interfaces/IHexTile";
import { HexTileType } from "../../../Data/Enums/HexTileType";
import { HexRotation } from "../../../Data/Enums/HexRotation";

export interface IWallTile {
    coord: IHexCoord;
    type: HexTileType;
    rotation: HexRotation;
}

export interface IWallShape {
    center: IHexCoord;
    minRadius: number;
    maxRadius: number;
    complexity: number; // 0-1, влияет на "извилистость" стены
}

export class WallGenerator {
    
    /**
     * Генерирует случайную замкнутую стену
     */
    public static generateRandomClosedWall(shape: IWallShape): IWallTile[] {
        // Для простых случаев используем правильный шестиугольник
        if (shape.complexity === 0 && shape.minRadius === shape.maxRadius) {
            return this.generateRegularHexagonWall(shape.center, shape.minRadius);
        }
        
        // Для сложных случаев используем случайный алгоритм
        const wallPath = this.generateRandomClosedPath(shape);
        return this.convertPathToWallTiles(wallPath);
    }
    
    /**
     * Генерирует правильную шестиугольную стену
     */
    private static generateRegularHexagonWall(center: IHexCoord, radius: number): IWallTile[] {
        const wallTiles: IWallTile[] = [];
        
        if (radius === 0) {
            // Центральная точка
            wallTiles.push({
                coord: center,
                type: HexTileType.WallStraight,
                rotation: HexRotation.Rotate0
            });
            return wallTiles;
        }
        
        // Генерируем точки по периметру шестиугольника
        const perimeterCoords: IHexCoord[] = [];
        
        // Направления для шестиугольника: 0°, 60°, 120°, 180°, 240°, 300°
        const directions = [
            { q: 1, r: 0 },   // 0°
            { q: 1, r: -1 },  // 60°
            { q: 0, r: -1 },  // 120°
            { q: -1, r: 0 },  // 180°
            { q: -1, r: 1 },  // 240°
            { q: 0, r: 1 }    // 300°
        ];
        
        // Генерируем точки по периметру
        for (let i = 0; i < 6; i++) {
            const direction = directions[i];
            const coord = {
                q: center.q + direction.q * radius,
                r: center.r + direction.r * radius
            };
            perimeterCoords.push(coord);
        }
        
        // Преобразуем в тайлы стены
        for (let i = 0; i < perimeterCoords.length; i++) {
            const coord = perimeterCoords[i];
            const nextCoord = perimeterCoords[(i + 1) % perimeterCoords.length];
            const prevCoord = perimeterCoords[(i - 1 + perimeterCoords.length) % perimeterCoords.length];
            
            const wallType = this.selectWallType(coord, prevCoord, nextCoord);
            const rotation = this.calculateWallRotation(coord, prevCoord, nextCoord);
            
            wallTiles.push({
                coord,
                type: wallType,
                rotation
            });
        }
        
        return wallTiles;
    }
    
    /**
     * Генерирует случайный замкнутый путь для стены
     */
    private static generateRandomClosedPath(shape: IWallShape): IHexCoord[] {
        // Пока используем простой круг как fallback
        return this.generateSimpleCircle(shape.center, shape.minRadius);
    }
    
    /**
     * Генерирует простой круг как fallback
     */
    private static generateSimpleCircle(center: IHexCoord, radius: number): IHexCoord[] {
        const coords: IHexCoord[] = [];
        
        for (let q = -radius; q <= radius; q++) {
            const r1 = Math.max(-radius, -q - radius);
            const r2 = Math.min(radius, -q + radius);
            
            for (let r = r1; r <= r2; r++) {
                const coord = { q: center.q + q, r: center.r + r };
                if (this.hexDistance(coord, center) === radius) {
                    coords.push(coord);
                }
            }
        }
        
        return this.orderCoordsClockwise(coords, center);
    }
    
    /**
     * Преобразует путь в тайлы стены
     */
    private static convertPathToWallTiles(path: IHexCoord[]): IWallTile[] {
        const wallTiles: IWallTile[] = [];
        
        for (let i = 0; i < path.length - 1; i++) {
            const coord = path[i];
            const nextCoord = path[i + 1];
            const prevCoord = path[(i - 1 + path.length) % path.length];
            
            const wallType = this.selectWallType(coord, prevCoord, nextCoord);
            const rotation = this.calculateWallRotation(coord, prevCoord, nextCoord);
            
            wallTiles.push({
                coord,
                type: wallType,
                rotation
            });
        }
        
        return wallTiles;
    }
    
    /**
     * Выбирает тип стены на основе соседних тайлов
     */
    private static selectWallType(coord: IHexCoord, prevCoord: IHexCoord, nextCoord: IHexCoord): HexTileType {
        const neighbors = this.getNeighborCoords(coord);
        let wallNeighbors = 0;
        let isCorner = false;
        
        // Проверяем, является ли это углом
        const prevDirection = this.getDirection(coord, prevCoord);
        const nextDirection = this.getDirection(coord, nextCoord);
        const directionDiff = Math.abs(prevDirection - nextDirection);
        isCorner = directionDiff > 1 && directionDiff < 5;
        
        // Подсчитываем соседние стены
        for (const neighbor of neighbors) {
            if (this.isWallCoord(neighbor, [prevCoord, nextCoord])) {
                wallNeighbors++;
            }
        }
        
        // Выбираем тип стены
        if (isCorner) {
            // Угловые тайлы
            if (wallNeighbors <= 2) {
                return Math.random() < 0.3 ? HexTileType.WallCornerAGate : HexTileType.WallCornerAOutside;
            } else {
                return HexTileType.WallCornerAInside;
            }
        } else {
            // Прямые тайлы
            if (wallNeighbors <= 2) {
                return Math.random() < 0.2 ? HexTileType.WallStraightGate : HexTileType.WallStraight;
            } else {
                return HexTileType.WallStraight;
            }
        }
    }
    
    /**
     * Вычисляет поворот стены
     */
    private static calculateWallRotation(coord: IHexCoord, prevCoord: IHexCoord, nextCoord: IHexCoord): HexRotation {
        const direction = this.getWallDirection(coord, prevCoord, nextCoord);
        
        switch (direction) {
            case 0: return HexRotation.Rotate0;
            case 1: return HexRotation.Rotate60;
            case 2: return HexRotation.Rotate120;
            case 3: return HexRotation.Rotate180;
            case 4: return HexRotation.Rotate240;
            case 5: return HexRotation.Rotate300;
            default: return HexRotation.Rotate0;
        }
    }
    
    /**
     * Получает направление между двумя точками
     */
    private static getDirection(from: IHexCoord, to: IHexCoord): number {
        const dq = to.q - from.q;
        const dr = to.r - from.r;
        
        if (dq === 1 && dr === 0) return 0;
        if (dq === 1 && dr === -1) return 1;
        if (dq === 0 && dr === -1) return 2;
        if (dq === -1 && dr === 0) return 3;
        if (dq === -1 && dr === 1) return 4;
        if (dq === 0 && dr === 1) return 5;
        
        return 0;
    }
    
    /**
     * Получает координаты соседей
     */
    private static getNeighborCoords(coord: IHexCoord): IHexCoord[] {
        return [
            { q: coord.q + 1, r: coord.r },
            { q: coord.q + 1, r: coord.r - 1 },
            { q: coord.q, r: coord.r - 1 },
            { q: coord.q - 1, r: coord.r },
            { q: coord.q - 1, r: coord.r + 1 },
            { q: coord.q, r: coord.r + 1 }
        ];
    }
    
    /**
     * Проверяет, является ли координата частью стены
     */
    private static isWallCoord(coord: IHexCoord, wallCoords: IHexCoord[]): boolean {
        return wallCoords.some(wallCoord => 
            wallCoord.q === coord.q && wallCoord.r === coord.r
        );
    }
    
    /**
     * Определяет направление стены
     */
    private static getWallDirection(coord: IHexCoord, prevCoord: IHexCoord, nextCoord: IHexCoord): number {
        const neighbors = this.getNeighborCoords(coord);
        
        for (let i = 0; i < neighbors.length; i++) {
            if (this.isWallCoord(neighbors[i], [prevCoord, nextCoord])) {
                return i;
            }
        }
        
        return 0;
    }
    
    /**
     * Вычисляет расстояние между двумя гексами
     */
    private static hexDistance(a: IHexCoord, b: IHexCoord): number {
        return (Math.abs(a.q - b.q) + Math.abs(a.q + a.r - b.q - b.r) + Math.abs(a.r - b.r)) / 2;
    }
    
    /**
     * Сортирует координаты по часовой стрелке
     */
    private static orderCoordsClockwise(coords: IHexCoord[], center: IHexCoord): IHexCoord[] {
        return coords.sort((a, b) => {
            const angleA = Math.atan2(a.r - center.r, a.q - center.q);
            const angleB = Math.atan2(b.r - center.r, b.q - center.q);
            return angleA - angleB;
        });
    }
    
    /**
     * Преобразует координату в строку
     */
    private static coordToString(coord: IHexCoord): string {
        return `${coord.q},${coord.r}`;
    }
} 