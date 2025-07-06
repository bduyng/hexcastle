import * as THREE from 'three';
import WindmillBlades from "../../Scene/GameScene/CastleScene/HexTile/HexTileParts/WindmillBlades";
import { HexTilePartType } from "../Enums/HexTilePartType";
import { HexTileType } from "../Enums/HexTileType";
import CastleFlag from '../../Scene/GameScene/CastleScene/HexTile/HexTileParts/CastleFlag';

const HexTilePartsConfig = {
    [HexTileType.WindmillBlue]: {
        className: WindmillBlades,
        type: HexTilePartType.WindmillBlades,
    },
    [HexTileType.WindmillRed]: {
        className: WindmillBlades,
        type: HexTilePartType.WindmillBlades,
    },
    [HexTileType.CastleBlue]: {
        className: CastleFlag,
        type: HexTilePartType.CastleFlag,
    },
}

const PartsConfig = {
    [HexTilePartType.WindmillBlades]: {
        viewPosition: new THREE.Vector3(0, 0.95, 0.33),
        speed: {
            min: 0.5,
            max: 1.5
        }
    },
    [HexTilePartType.CastleFlag]: {
        viewPositions: [
            new THREE.Vector3(0, 3.9, 0),
            new THREE.Vector3(0.66, 1.685, 0.39),
            new THREE.Vector3(-0.66, 1.685, -0.39),
            new THREE.Vector3(-0.66, 2.09, 0.39),
            new THREE.Vector3(0.66, 2.09, -0.39),
        ],
    }
}


export { HexTilePartsConfig, PartsConfig };
