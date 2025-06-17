import { HexTileType } from "../Enums/HexTileType";
import { HexTileCategory } from "../Enums/HexTileCategory";

const HexTilesByCategory: { [key in HexTileCategory]: HexTileType[] } = {
    [HexTileCategory.Base]: [
        HexTileType.Grass,
        HexTileType.Water,
    ],
    [HexTileCategory.Roads]: [
        HexTileType.RoadA,
        HexTileType.RoadB,
        HexTileType.RoadC,
        HexTileType.RoadD,
        HexTileType.RoadE,
        HexTileType.RoadF,
        HexTileType.RoadG,
        HexTileType.RoadH,
        HexTileType.RoadI,
        HexTileType.RoadJ,
        HexTileType.RoadK,
        HexTileType.RoadL,
        HexTileType.RoadM,
    ],
    [HexTileCategory.Coast]: [
        HexTileType.CoastA,
        HexTileType.CoastB,
        HexTileType.CoastC,
        HexTileType.CoastD,
        HexTileType.CoastE,
    ],
    [HexTileCategory.Rivers]: [
        HexTileType.RiverA,
        HexTileType.RiverACurvy,
        HexTileType.RiverB,
        HexTileType.RiverC,
        HexTileType.RiverCrossingA,
        HexTileType.RiverCrossingB,
        HexTileType.RiverD,
        HexTileType.RiverE,
        HexTileType.RiverF,
        HexTileType.RiverG,
        HexTileType.RiverH,
        HexTileType.RiverI,
        HexTileType.RiverJ,
        HexTileType.RiverK,
        HexTileType.RiverL,
    ],
}


export { HexTilesByCategory };
