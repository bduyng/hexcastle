import { IHexCoord } from "../../../Data/Interfaces/IHexTile";

export interface IWallTile {
    coord: IHexCoord;
}

export interface IWallShape {
    center: IHexCoord;
    radius: number;
    maxOffset: number;
}

export class WallGeneratorSnakeLoop {
    
    public static generateClosedWall(shape: IWallShape): IWallTile[] {
        const wallTiles: IWallTile[] = [];
        
        return wallTiles;
    }
    
} 