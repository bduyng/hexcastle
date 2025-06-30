import * as THREE from 'three';
import WindmillBlades from "../../Scene/GameScene/CastleScene/HexTile/HexTileParts/WindmillBlades";
import { HexTilePartType } from "../Enums/HexTilePartType";
import { HexTileType } from "../Enums/HexTileType";

const HexTilePartsConfig = {
    [HexTileType.WindmillBlue]: {
        className: WindmillBlades,
        type: HexTilePartType.WindmillBlades,
    },
    [HexTileType.WindmillRed]: {
        className: WindmillBlades,
        type: HexTilePartType.WindmillBlades,
    },
}

const PartsConfig = {
    [HexTilePartType.WindmillBlades]: {
        viewPosition: new THREE.Vector3(0, 0.95, 0.33),
        speed: {
            min: 0.5,
            max: 1.5
        }
    }
}


export { HexTilePartsConfig, PartsConfig };
