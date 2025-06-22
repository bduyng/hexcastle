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
    
    public static generateRandomClosedWall(shape: IWallShape): IWallTile[] {
        const wallTiles: IWallTile[] = [];
        
        const baseRing = this.generateHexRing(shape.center, shape.radius);
        const offsetRing = this.applyOffsetToRing(baseRing, shape.maxOffset);
        
        for (const coord of offsetRing) {
            wallTiles.push({ coord });
        }
        
        return wallTiles;
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
    
} 