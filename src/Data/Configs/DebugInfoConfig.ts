import { TileEdgeType } from "../Enums/TileEdgeType";
import { HexRotation } from "../Enums/HexRotation";
import { HexTileCategory } from "../Enums/HexTileCategory";

const RotationAngleName: { [key in HexRotation]: string } = {
    0: '0°',
    1: '60°',
    2: '120°',
    3: '180°',
    4: '240°',
    5: '300°'
}

const TileDebugInfoConfigByCategory = {
    [HexTileCategory.Base]: {
        positionY: 0.03,
    },
    [HexTileCategory.Roads]: {
        positionY: 0.03,
    },
    [HexTileCategory.Coast]: {
        positionY: 0.03,
    },
    [HexTileCategory.Rivers]: {
        positionY: 0.03,
    },
    [HexTileCategory.Walls]: {
        positionY: 1.03,
    },
}


const EdgeColor: { [key in TileEdgeType]: string } = {
    [TileEdgeType.Grass]: '#00aa00',
    [TileEdgeType.Road]: '#aa00aa',
    [TileEdgeType.Coast]: '#aaaa00',
    [TileEdgeType.Water]: '#0000aa',
    [TileEdgeType.River]: '#00aaaa',
    [TileEdgeType.Wall]: '#ff6600',
    [TileEdgeType.Empty]: '#aaaaaa',
}

export { RotationAngleName, EdgeColor, TileDebugInfoConfigByCategory };
