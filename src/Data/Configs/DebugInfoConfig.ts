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

const EdgeColor: { [key in TileEdgeType]: string } = {
    [TileEdgeType.Grass]: '#00aa00',
    [TileEdgeType.Road]: '#aa00aa',
}

export { RotationAngleName, EdgeColor };
