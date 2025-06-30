import { GenerateEntityType } from "../../Enums/GenerateEntityType";

const DebugConfig = {
    fpsMeter: false,
    rendererStats: false,
    orbitControls: true,
    showAxisHelper: false,
    gui: false,
};

const DebugGameConfig = {
    tilesDebugMode: null, // HexTileCategory.Walls,
    grid: false,
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
        },
        [GenerateEntityType.Nature]: {
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
