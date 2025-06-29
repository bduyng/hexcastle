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
        showTilesDelays: {
            min: 5,
            max: 20,
            coeff: 100,
        }
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
        },
    },
    walls: {
        showTilesDelays: 50,
        secondWallChance: 0.5,
        secondWallMinRadius: 2,
        maxWallRadius: 6,
        maxWallOffset: 2,
        rules: [
            {
                radiusAvailable: 1,
                maxOffset: [0, 0],
            },
            {
                radiusAvailable: 4,
                maxOffset: [1, 1],
            },
            {
                radiusAvailable: Infinity,
                maxOffset: [1, 2],
            }
        ]
    },
    city: {
        showTilesDelays: 80,
        fillPercentage: 0.4,
    },
    nature: {
        showTilesDelays: 60,
    }
}


export { GameConfig };
