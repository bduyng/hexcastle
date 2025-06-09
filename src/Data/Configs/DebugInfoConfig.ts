import { TileEdgeType } from "../Enums/TileEdgeType";
import { HexRotation } from "../Enums/HexRotation";

const RotationAngleName: { [key in HexRotation]: string } = {
    0: '0°',
    1: '60°',
    2: '120°',
    3: '180°',
    4: '240°',
    5: '300°'
}

const EdgeColor: { [key in TileEdgeType]: number } = {
    [TileEdgeType.Grass]: 0x00aa00,
    [TileEdgeType.Road]: 0xaa00aa,
}

export { RotationAngleName, EdgeColor };
