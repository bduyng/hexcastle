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
            showInstantly: true,
            hexTileDebug: {
                rotation: false,
                edge: false,
            },
            entropy: true,
            topLevelAvailability: false,
            islands: true,
        },
        [GenerateEntityType.Walls]: {
            show: false,
            showInstantly: true,
            hexTileDebug: {
                rotation: false,
                edge: false,
            },
            innerOuterTiles: false,
        }
    },
}


export { DebugConfig, DebugGameConfig };
