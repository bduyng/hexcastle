import { GenerateEntityType } from "../../Enums/GenerateEntityType";

const DebugConfig = {
    fpsMeter: true,
    rendererStats: true,
    orbitControls: true,
    showAxisHelper: false,
    gui: true,
};

const DebugGameConfig = {
    tilesDebugMode: null, // HexTileCategory.Walls,
    grid: false,
    generateType: {
        [GenerateEntityType.Landscape]: {
            show: true,
            showInstantly: true,
            hexTileDebug: {
                rotation: false,
                edge: false,
            },
            entropy: false,
            topLevelAvailability: false,
            islands: false,
        },
        [GenerateEntityType.Walls]: {
            show: true,
            showInstantly: true,
            hexTileDebug: {
                rotation: false,
                edge: false,
            },
            innerOuterTiles: true,
        },
        [GenerateEntityType.City]: {
            show: true,
            showInstantly: true,
            hexTileDebug: {
                rotation: false,
                edge: false,
            },
        }
    },
}


export { DebugConfig, DebugGameConfig };
