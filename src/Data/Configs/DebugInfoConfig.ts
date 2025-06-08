import { EdgeType } from "../Enums/EdgeType";
import { HexRotation } from "../Enums/HexRotation";

const RotationAngleName: { [key in HexRotation]: string } = {
    0: '0°',
    1: '60°',
    2: '120°',
    3: '180°',
    4: '240°',
    5: '300°'
}

const EdgeColor: { [key in EdgeType]: number } = {
    [EdgeType.Grass]: 0x00aa00,
    [EdgeType.Road]: 0xaa00aa,
}

export { RotationAngleName, EdgeColor };
