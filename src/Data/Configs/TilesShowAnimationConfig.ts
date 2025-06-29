import { HexTileType } from "../Enums/HexTileType";
import { ITileShowAnimationConfig } from "../Interfaces/IHexTile";
import TWEEN from 'three/addons/libs/tween.module.js';

const TilesShowAnimationConfig: { [key in HexTileType]: ITileShowAnimationConfig } = {
    // Base tiles
    [HexTileType.Grass]: {
        time: 100,
        easing: TWEEN.Easing.Quadratic.Out
    },
    [HexTileType.Water]: {
        time: 100,
        easing: TWEEN.Easing.Quadratic.Out
    },

    // Roads
    [HexTileType.RoadA]: {
        time: 100,
        easing: TWEEN.Easing.Quadratic.Out
    },
    [HexTileType.RoadB]: {
        time: 100,
        easing: TWEEN.Easing.Quadratic.Out
    },
    [HexTileType.RoadC]: {
        time: 100,
        easing: TWEEN.Easing.Quadratic.Out
    },
    [HexTileType.RoadD]: {
        time: 100,
        easing: TWEEN.Easing.Quadratic.Out
    },
    [HexTileType.RoadE]: {
        time: 100,
        easing: TWEEN.Easing.Quadratic.Out
    },
    [HexTileType.RoadF]: {
        time: 100,
        easing: TWEEN.Easing.Quadratic.Out
    },
    [HexTileType.RoadG]: {
        time: 100,
        easing: TWEEN.Easing.Quadratic.Out
    },
    [HexTileType.RoadH]: {
        time: 100,
        easing: TWEEN.Easing.Quadratic.Out
    },
    [HexTileType.RoadI]: {
        time: 100,
        easing: TWEEN.Easing.Quadratic.Out
    },
    [HexTileType.RoadJ]: {
        time: 100,
        easing: TWEEN.Easing.Quadratic.Out
    },
    [HexTileType.RoadK]: {
        time: 100,
        easing: TWEEN.Easing.Quadratic.Out
    },
    [HexTileType.RoadL]: {
        time: 100,
        easing: TWEEN.Easing.Quadratic.Out
    },
    [HexTileType.RoadM]: {
        time: 100,
        easing: TWEEN.Easing.Quadratic.Out
    },

    // Coast
    [HexTileType.CoastA]: {
        time: 100,
        easing: TWEEN.Easing.Quadratic.Out
    },
    [HexTileType.CoastB]: {
        time: 100,
        easing: TWEEN.Easing.Quadratic.Out
    },
    [HexTileType.CoastC]: {
        time: 100,
        easing: TWEEN.Easing.Quadratic.Out
    },
    [HexTileType.CoastD]: {
        time: 100,
        easing: TWEEN.Easing.Quadratic.Out
    },
    [HexTileType.CoastE]: {
        time: 100,
        easing: TWEEN.Easing.Quadratic.Out
    },

    // Rivers
    [HexTileType.RiverA]: {
        time: 100,
        easing: TWEEN.Easing.Quadratic.Out
    },
    [HexTileType.RiverACurvy]: {
        time: 100,
        easing: TWEEN.Easing.Quadratic.Out
    },
    [HexTileType.RiverB]: {
        time: 100,
        easing: TWEEN.Easing.Quadratic.Out
    },
    [HexTileType.RiverC]: {
        time: 100,
        easing: TWEEN.Easing.Quadratic.Out
    },
    [HexTileType.RiverCrossingA]: {
        time: 100,
        easing: TWEEN.Easing.Quadratic.Out
    },
    [HexTileType.RiverCrossingB]: {
        time: 100,
        easing: TWEEN.Easing.Quadratic.Out
    },
    [HexTileType.RiverD]: {
        time: 100,
        easing: TWEEN.Easing.Quadratic.Out
    },
    [HexTileType.RiverE]: {
        time: 100,
        easing: TWEEN.Easing.Quadratic.Out
    },
    [HexTileType.RiverF]: {
        time: 100,
        easing: TWEEN.Easing.Quadratic.Out
    },
    [HexTileType.RiverG]: {
        time: 100,
        easing: TWEEN.Easing.Quadratic.Out
    },
    [HexTileType.RiverH]: {
        time: 100,
        easing: TWEEN.Easing.Quadratic.Out
    },
    [HexTileType.RiverI]: {
        time: 100,
        easing: TWEEN.Easing.Quadratic.Out
    },
    [HexTileType.RiverJ]: {
        time: 100,
        easing: TWEEN.Easing.Quadratic.Out
    },
    [HexTileType.RiverK]: {
        time: 100,
        easing: TWEEN.Easing.Quadratic.Out
    },
    [HexTileType.RiverL]: {
        time: 100,
        easing: TWEEN.Easing.Quadratic.Out
    },

    // Walls
    [HexTileType.WallCornerAGate]: {
        time: 400,
        easing: TWEEN.Easing.Back.Out
    },
    [HexTileType.WallCornerAInside]: {
        time: 400,
        easing: TWEEN.Easing.Back.Out
    },
    [HexTileType.WallCornerAOutside]: {
        time: 400,
        easing: TWEEN.Easing.Back.Out
    },
    [HexTileType.WallCornerBInside]: {
        time: 400,
        easing: TWEEN.Easing.Back.Out
    },
    [HexTileType.WallCornerBOutside]: {
        time: 400,
        easing: TWEEN.Easing.Back.Out
    },
    [HexTileType.WallStraight]: {
        time: 400,
        easing: TWEEN.Easing.Back.Out
    },
    [HexTileType.WallStraightGate]: {
        time: 400,
        easing: TWEEN.Easing.Back.Out
    },

    // Nature
    [HexTileType.MountainA]: {
        time: 100,
        easing: TWEEN.Easing.Quadratic.Out
    },

    // City
    [HexTileType.Castle]: {
        time: 400,
        easing: TWEEN.Easing.Back.Out
    },
    [HexTileType.ArcheryRange]: {
        time: 400,
        easing: TWEEN.Easing.Back.Out
    },
    [HexTileType.Barracks]: {
        time: 400,
        easing: TWEEN.Easing.Back.Out
    },
    [HexTileType.Church]: {
        time: 400,
        easing: TWEEN.Easing.Back.Out
    },
    [HexTileType.HomeB]: {
        time: 400,
        easing: TWEEN.Easing.Back.Out
    },
    [HexTileType.Market]: {
        time: 400,
        easing: TWEEN.Easing.Back.Out
    },
    [HexTileType.Tavern]: {
        time: 400,
        easing: TWEEN.Easing.Back.Out
    },
    [HexTileType.Well]: {
        time: 400,
        easing: TWEEN.Easing.Back.Out
    },
    [HexTileType.Windmill]: {
        time: 400,
        easing: TWEEN.Easing.Back.Out
    },

}

export { TilesShowAnimationConfig };
