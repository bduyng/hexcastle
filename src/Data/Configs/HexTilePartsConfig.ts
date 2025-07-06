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
        viewPosition: new THREE.Vector3(0, 3.9, 0),
    }
}


export { HexTilePartsConfig, PartsConfig };
