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
            hexTileDebug: {
                rotation: false,
                edge: false,
            },
            showInstantly: false,
            entropy: false,
        },
        [GenerateEntityType.Walls]: {
            hexTileDebug: {
                rotation: false,
                edge: false,
            },
            showInstantly: false,
        }
    },
}


export { DebugConfig, DebugGameConfig };
