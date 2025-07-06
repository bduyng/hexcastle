import * as THREE from 'three';
import WindmillBlades from "../../Scene/GameScene/CastleScene/HexTile/HexTileParts/WindmillBlades";
import { HexTilePartType } from "../Enums/HexTilePartType";
import { HexTileType } from "../Enums/HexTileType";
import CastleFlagBlue from '../../Scene/GameScene/CastleScene/HexTile/HexTileParts/CastleFlagBlue';
import CastleFlagRed from '../../Scene/GameScene/CastleScene/HexTile/HexTileParts/CastleFlagRed';

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
        className: CastleFlagBlue,
        type: HexTilePartType.CastleFlagBlue,
    },
    [HexTileType.CastleRed]: {
        className: CastleFlagRed,
        type: HexTilePartType.CastleFlagRed,
    },
}

const PartsConfig = {
    [HexTilePartType.WindmillBlades]: {
        viewPosition: new THREE.Vector3(0, 0.95, 0.38),
        speed: {
            min: 0.5,
            max: 1.5
        }
    },
    [HexTilePartType.CastleFlagBlue]: {
        viewPositions: [
            new THREE.Vector3(0, 3.9, 0),
            new THREE.Vector3(0.66, 1.685, 0.39),
            new THREE.Vector3(-0.66, 1.685, -0.39),
            new THREE.Vector3(-0.66, 2.09, 0.39),
            new THREE.Vector3(0.66, 2.09, -0.39),
        ],
    },
    [HexTilePartType.CastleFlagRed]: {
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
