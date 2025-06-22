import { IHexCoord } from "../../../Data/Interfaces/IHexTile";

export interface IWallTile {
    coord: IHexCoord;
}

export interface IWallShape {
    center: IHexCoord;
    radius: number;
    maxOffset: number;
}

export class WallGenerator {
    
    /**
     * Генерирует замкнутую стену в форме гексагонального кольца
     * @param shape - параметры формы стены
     * @returns массив позиций тайлов стены
     */
    public static generateRandomClosedWall(shape: IWallShape): IWallTile[] {
        const wallTiles: IWallTile[] = [];
        
        // Генерируем базовое кольцо с радиусом
        const baseRing = this.generateHexRing(shape.center, shape.radius);
        
        // Применяем смещения к связанной кривой
        const offsetRing = this.applyOffsetToRing(baseRing, shape.maxOffset);
        
        // Преобразуем в массив тайлов
        for (const coord of offsetRing) {
            wallTiles.push({ coord });
        }
        
        return wallTiles;
    }
    
    /**
     * Применяет смещения к кольцу, сохраняя связность
     * @param ring - исходное кольцо
     * @param maxOffset - максимальное смещение
     * @returns кольцо со смещениями
     */
    private static applyOffsetToRing(ring: IHexCoord[], maxOffset: number): IHexCoord[] {
        if (maxOffset === 0 || ring.length === 0) {
            return ring;
        }
        
        const offsetRing: IHexCoord[] = [];
        const center = this.calculateRingCenter(ring);
        
        // Применяем смещения к каждой точке кольца
        for (let i = 0; i < ring.length; i++) {
            const coord = ring[i];
            
            // Вычисляем направление от центра
            const directionQ = coord.q - center.q;
            const directionR = coord.r - center.r;
            
            // Нормализуем направление
            const length = Math.sqrt(directionQ * directionQ + directionR * directionR);
            const normalizedQ = length > 0 ? directionQ / length : 0;
            const normalizedR = length > 0 ? directionR / length : 0;
            
            // Применяем смещение в направлении от центра
            const offset = Math.floor(Math.random() * (maxOffset + 1));
            const offsetCoord = {
                q: coord.q + Math.round(normalizedQ * offset),
                r: coord.r + Math.round(normalizedR * offset)
            };
            
            offsetRing.push(offsetCoord);
        }
        
        // Исправляем связность
        return this.fixRingConnectivity(offsetRing);
    }
    
    /**
     * Вычисляет центр кольца
     * @param ring - кольцо координат
     * @returns центр кольца
     */
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
    
    /**
     * Исправляет связность кольца, добавляя промежуточные точки
     * @param ring - кольцо координат
     * @returns исправленное кольцо
     */
    private static fixRingConnectivity(ring: IHexCoord[]): IHexCoord[] {
        if (ring.length < 2) {
            return ring;
        }
        
        const fixedRing: IHexCoord[] = [];
        
        for (let i = 0; i < ring.length; i++) {
            const current = ring[i];
            const next = ring[(i + 1) % ring.length];
            
            fixedRing.push(current);
            
            // Проверяем расстояние до следующей точки
            const distance = this.getHexDistance(current, next);
            
            // Если расстояние больше 1, добавляем промежуточные точки
            if (distance > 1) {
                const intermediatePoints = this.getPathBetweenPoints(current, next);
                fixedRing.push(...intermediatePoints);
            }
        }
        
        return fixedRing;
    }
    
    /**
     * Получает путь между двумя точками в гексагональной сетке
     * @param start - начальная точка
     * @param end - конечная точка
     * @returns массив промежуточных точек
     */
    private static getPathBetweenPoints(start: IHexCoord, end: IHexCoord): IHexCoord[] {
        const path: IHexCoord[] = [];
        const distance = this.getHexDistance(start, end);
        
        if (distance <= 1) {
            return path;
        }
        
        // Используем алгоритм Брезенхэма для гексагонов
        let current = { ...start };
        
        while (this.getHexDistance(current, end) > 1) {
            // Находим направление к цели
            const dq = end.q - current.q;
            const dr = end.r - current.r;
            
            // Выбираем направление движения
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
    
    /**
     * Генерирует гексагональное кольцо заданного радиуса как замкнутую кривую
     * @param center - центр кольца
     * @param radius - радиус кольца
     * @returns массив координат кольца
     */
    private static generateHexRing(center: IHexCoord, radius: number): IHexCoord[] {
        const ring: IHexCoord[] = [];
        
        if (radius === 0) {
            return [center];
        }
        
        // Для гексагональной сетки с острыми вершинами (pointy-top)
        // Вычисляем все координаты кольца
        for (let q = -radius; q <= radius; q++) {
            for (let r = -radius; r <= radius; r++) {
                const s = -q - r;
                
                // Проверяем, что координата находится на кольце (расстояние = radius)
                if (Math.max(Math.abs(q), Math.abs(r), Math.abs(s)) === radius) {
                    ring.push({
                        q: center.q + q,
                        r: center.r + r
                    });
                }
            }
        }
        
        // Сортируем координаты по углу для создания правильного порядка
        ring.sort((a, b) => {
            const angleA = Math.atan2(a.r - center.r, a.q - center.q);
            const angleB = Math.atan2(b.r - center.r, b.q - center.q);
            return angleA - angleB;
        });
        
        return ring;
    }
    
    /**
     * Генерирует замкнутую стену с дополнительными параметрами для более сложных форм
     * @param shape - параметры формы стены
     * @param irregularity - степень неправильности (0-1)
     * @returns массив позиций тайлов стены
     */
    public static generateIrregularClosedWall(shape: IWallShape, irregularity: number = 0.3): IWallTile[] {
        const wallTiles: IWallTile[] = [];
        
        // Генерируем базовое кольцо
        const baseRadius = shape.radius;
        const ring = this.generateHexRing(shape.center, baseRadius);
        
        // Применяем переменное смещение для создания неправильности
        const adjustedMaxOffset = Math.floor(shape.maxOffset * irregularity);
        const offsetRing = this.applyOffsetToRing(ring, adjustedMaxOffset);
        
        // Преобразуем в массив тайлов
        for (const coord of offsetRing) {
            wallTiles.push({ coord });
        }
        
        return wallTiles;
    }
    
    /**
     * Применяет фиксированное смещение к координате
     * @param coord - исходная координата
     * @param offset - смещение
     * @returns координата со смещением
     */
    private static applyOffset(coord: IHexCoord, offset: number): IHexCoord {
        if (offset === 0) {
            return coord;
        }
        
        // Применяем смещение в случайном направлении
        const angle = Math.random() * Math.PI * 2;
        const offsetQ = Math.round(Math.cos(angle) * Math.abs(offset));
        const offsetR = Math.round(Math.sin(angle) * Math.abs(offset));
        
        return {
            q: coord.q + offsetQ,
            r: coord.r + offsetR
        };
    }
    
    /**
     * Генерирует замкнутую стену с контролируемыми изгибами
     * @param shape - параметры формы стены
     * @param bendPoints - количество точек изгиба
     * @returns массив позиций тайлов стены
     */
    public static generateBentClosedWall(shape: IWallShape, bendPoints: number = 4): IWallTile[] {
        const wallTiles: IWallTile[] = [];
        
        // Генерируем базовое кольцо
        const ring = this.generateHexRing(shape.center, shape.radius);
        
        // Создаем точки изгиба
        const bendIndices: number[] = [];
        for (let i = 0; i < bendPoints; i++) {
            const index = Math.floor((i + 1) * ring.length / (bendPoints + 1));
            bendIndices.push(index);
        }
        
        // Применяем изгибы в точках
        for (let i = 0; i < ring.length; i++) {
            const coord = ring[i];
            
            // Находим ближайшую точку изгиба
            let minDistance = Infinity;
            let bendDirection = 0;
            
            for (const bendIndex of bendIndices) {
                const distance = Math.abs(i - bendIndex);
                if (distance < minDistance) {
                    minDistance = distance;
                    bendDirection = (i < bendIndex) ? 1 : -1;
                }
            }
            
            // Применяем изгиб
            const bendStrength = Math.max(0, 1 - minDistance / (ring.length / bendPoints));
            const bendOffset = Math.floor(bendStrength * shape.maxOffset * bendDirection);
            
            const offsetCoord = this.applyOffset(coord, bendOffset);
            wallTiles.push({ coord: offsetCoord });
        }
        
        return wallTiles;
    }
    
    /**
     * Генерирует связанную замкнутую стену с гарантированной связностью
     * @param shape - параметры формы стены
     * @returns массив позиций тайлов стены
     */
    public static generateConnectedClosedWall(shape: IWallShape): IWallTile[] {
        const wallTiles: IWallTile[] = [];
        
        // Генерируем базовое кольцо
        const baseRing = this.generateHexRing(shape.center, shape.radius);
        
        // Создаем связанный путь
        for (let i = 0; i < baseRing.length; i++) {
            const coord = baseRing[i];
            
            // Применяем небольшое смещение, сохраняя связность
            const offsetCoord = this.applySmallOffset(coord, shape.maxOffset, i, baseRing.length);
            wallTiles.push({ coord: offsetCoord });
        }
        
        // Проверяем и исправляем связность
        return this.ensureConnectivity(wallTiles);
    }
    
    /**
     * Применяет небольшое смещение для сохранения связности
     * @param coord - исходная координата
     * @param maxOffset - максимальное смещение
     * @param index - индекс в массиве
     * @param totalLength - общая длина массива
     * @returns координата со смещением
     */
    private static applySmallOffset(coord: IHexCoord, maxOffset: number, index: number, totalLength: number): IHexCoord {
        if (maxOffset === 0) {
            return coord;
        }
        
        // Используем только небольшое смещение для сохранения связности
        const smallOffset = Math.max(1, Math.floor(maxOffset * 0.3));
        
        // Создаем плавное смещение
        const angle = (index / totalLength) * Math.PI * 2;
        const waveOffset = Math.sin(index * 0.5) * smallOffset;
        
        const offsetQ = Math.round(Math.cos(angle) * waveOffset);
        const offsetR = Math.round(Math.sin(angle) * waveOffset);
        
        return {
            q: coord.q + offsetQ,
            r: coord.r + offsetR
        };
    }
    
    /**
     * Обеспечивает связность стены, исправляя разрывы
     * @param wallTiles - массив тайлов стены
     * @returns исправленный массив тайлов
     */
    private static ensureConnectivity(wallTiles: IWallTile[]): IWallTile[] {
        const connectedTiles: IWallTile[] = [];
        
        for (let i = 0; i < wallTiles.length; i++) {
            const current = wallTiles[i];
            const next = wallTiles[(i + 1) % wallTiles.length];
            
            connectedTiles.push(current);
            
            // Проверяем расстояние до следующего тайла
            const distance = this.getHexDistance(current.coord, next.coord);
            
            // Если расстояние больше 1, добавляем промежуточные тайлы
            if (distance > 1) {
                const intermediateTiles = this.getIntermediateTiles(current.coord, next.coord);
                connectedTiles.push(...intermediateTiles.map(coord => ({ coord })));
            }
        }
        
        return connectedTiles;
    }
    
    /**
     * Получает промежуточные тайлы между двумя координатами
     * @param coord1 - первая координата
     * @param coord2 - вторая координата
     * @returns массив промежуточных координат
     */
    private static getIntermediateTiles(coord1: IHexCoord, coord2: IHexCoord): IHexCoord[] {
        const intermediate: IHexCoord[] = [];
        const distance = this.getHexDistance(coord1, coord2);
        
        if (distance <= 1) {
            return intermediate;
        }
        
        // Вычисляем направление
        const dq = coord2.q - coord1.q;
        const dr = coord2.r - coord1.r;
        
        // Нормализуем направление
        const stepQ = Math.sign(dq);
        const stepR = Math.sign(dr);
        
        // Добавляем промежуточные точки
        let currentQ = coord1.q + stepQ;
        let currentR = coord1.r + stepR;
        
        while (this.getHexDistance({ q: currentQ, r: currentR }, coord2) > 1) {
            intermediate.push({ q: currentQ, r: currentR });
            currentQ += stepQ;
            currentR += stepR;
        }
        
        return intermediate;
    }
    
    /**
     * Проверяет, что стена образует замкнутую кривую
     * @param wallTiles - массив тайлов стены
     * @returns true, если стена замкнута
     */
    public static isWallClosed(wallTiles: IWallTile[]): boolean {
        if (wallTiles.length < 3) {
            return false;
        }
        
        // Проверяем, что каждый тайл соединен с двумя соседними
        for (let i = 0; i < wallTiles.length; i++) {
            const current = wallTiles[i];
            const next = wallTiles[(i + 1) % wallTiles.length];
            const prev = wallTiles[(i - 1 + wallTiles.length) % wallTiles.length];
            
            // Проверяем расстояние до соседей (должно быть 1)
            const distToNext = this.getHexDistance(current.coord, next.coord);
            const distToPrev = this.getHexDistance(current.coord, prev.coord);
            
            if (distToNext !== 1 || distToPrev !== 1) {
                return false;
            }
        }
        
        return true;
    }
    
    /**
     * Вычисляет расстояние между двумя гексагональными координатами
     * @param coord1 - первая координата
     * @param coord2 - вторая координата
     * @returns расстояние
     */
    private static getHexDistance(coord1: IHexCoord, coord2: IHexCoord): number {
        const dq = coord1.q - coord2.q;
        const dr = coord1.r - coord2.r;
        const ds = -dq - dr;
        
        return Math.max(Math.abs(dq), Math.abs(dr), Math.abs(ds));
    }
    
    /**
     * Тестовый метод для демонстрации работы алгоритма
     * @param center - центр стены
     * @param radius - радиус стены
     * @param maxOffset - максимальное смещение
     * @returns результат тестирования
     */
    public static testWallGeneration(center: IHexCoord, radius: number, maxOffset: number): {
        basicWall: IWallTile[];
        connectedWall: IWallTile[];
        isBasicConnected: boolean;
        isConnectedWallConnected: boolean;
    } {
        const shape: IWallShape = { center, radius, maxOffset };
        
        const basicWall = this.generateRandomClosedWall(shape);
        const connectedWall = this.generateConnectedClosedWall(shape);
        
        return {
            basicWall,
            connectedWall,
            isBasicConnected: this.isWallClosed(basicWall),
            isConnectedWallConnected: this.isWallClosed(connectedWall)
        };
    }
    
    /**
     * Генерирует базовое кольцо без смещений для тестирования
     * @param center - центр кольца
     * @param radius - радиус кольца
     * @returns массив координат кольца
     */
    public static generateBaseRing(center: IHexCoord, radius: number): IWallTile[] {
        const ring = this.generateHexRing(center, radius);
        return ring.map(coord => ({ coord }));
    }
    
    /**
     * Генерирует стену с контролируемыми смещениями, сохраняющими связность
     * @param shape - параметры формы стены
     * @param smoothness - плавность смещений (0-1)
     * @returns массив позиций тайлов стены
     */
    public static generateSmoothClosedWall(shape: IWallShape, smoothness: number = 0.5): IWallTile[] {
        const wallTiles: IWallTile[] = [];
        
        // Генерируем базовое кольцо
        const ring = this.generateHexRing(shape.center, shape.radius);
        
        // Применяем плавные смещения
        const smoothRing = this.applySmoothOffset(ring, shape.maxOffset, smoothness);
        
        // Преобразуем в массив тайлов
        for (const coord of smoothRing) {
            wallTiles.push({ coord });
        }
        
        return wallTiles;
    }
    
    /**
     * Применяет плавные смещения к кольцу
     * @param ring - исходное кольцо
     * @param maxOffset - максимальное смещение
     * @param smoothness - плавность
     * @returns кольцо с плавными смещениями
     */
    private static applySmoothOffset(ring: IHexCoord[], maxOffset: number, smoothness: number): IHexCoord[] {
        if (maxOffset === 0 || ring.length === 0) {
            return ring;
        }
        
        const offsetRing: IHexCoord[] = [];
        const center = this.calculateRingCenter(ring);
        
        // Создаем плавные смещения
        for (let i = 0; i < ring.length; i++) {
            const coord = ring[i];
            
            // Создаем волнообразное смещение
            const waveOffset = Math.sin(i * 0.5) * maxOffset * smoothness;
            const randomOffset = (Math.random() - 0.5) * maxOffset * (1 - smoothness);
            const totalOffset = Math.floor(waveOffset + randomOffset);
            
            // Применяем смещение в направлении от центра
            const directionQ = coord.q - center.q;
            const directionR = coord.r - center.r;
            
            const length = Math.sqrt(directionQ * directionQ + directionR * directionR);
            const normalizedQ = length > 0 ? directionQ / length : 0;
            const normalizedR = length > 0 ? directionR / length : 0;
            
            const offsetCoord = {
                q: coord.q + Math.round(normalizedQ * totalOffset),
                r: coord.r + Math.round(normalizedR * totalOffset)
            };
            
            offsetRing.push(offsetCoord);
        }
        
        // Исправляем связность
        return this.fixRingConnectivity(offsetRing);
    }
} 