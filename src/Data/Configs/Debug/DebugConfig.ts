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
    grid: true,
    generateType: {
        [GenerateEntityType.Landscape]: {
            show: true,
            showInstantly: false,
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
            showInstantly: false,
            hexTileDebug: {
                rotation: false,
                edge: false,
            },
            innerOuterTiles: false,
        },
        [GenerateEntityType.City]: {
            show: true,
            showInstantly: false,
            hexTileDebug: {
                rotation: false,
                edge: false,
            },
        }
    },
}


export { DebugConfig, DebugGameConfig };
