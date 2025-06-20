import { GridOrientation } from "../Enums/GridOrientation";

const GameConfig = {
    gameField: {
        hexSize: 1.15,
        GridOrientation: GridOrientation.PointyTop,
        radius: {
            min: 2,
            max: 13,
            default: 5
        },
        showTilesDelay: 10,
    }
}


export { GameConfig };
