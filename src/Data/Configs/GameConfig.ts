import { GridOrientation } from "../Enums/GridOrientation";

const GameConfig = {
    gameField: {
        hexSize: 1.15,
        GridOrientation: GridOrientation.PointyTop,
        radius: {
            min: 1,
            max: 20,
            default: 5
        },
        showTilesDelay: 10,
    },
    WFC: {
        syncGenerationRadius: 7,
        stepsPerFrame: {
            minimum: 2,
            values: [
                { radius: 10, steps: 10 },
                { radius: 15, steps: 5 },
                { radius: 20, steps: 3 },
                { radius: 25, steps: 2 }
            ]
        }
    }
}


export { GameConfig };
