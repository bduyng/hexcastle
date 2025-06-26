import * as THREE from 'three';
import * as PIXI from 'pixi.js';
import { HexTileType } from '../Enums/HexTileType';
import { TileEdgeType } from '../Enums/TileEdgeType';

export interface ILibrariesData {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    ambientLight: THREE.AmbientLight;
    directionalLight: THREE.DirectionalLight;
    pixiApp: PIXI.Application;
    uiContainer: PIXI.Container;
}

export interface IWindowSizes {
    width: number;
    height: number;
}

export interface IHexTilesRule {
    type: HexTileType;
    edges: TileEdgeType[];
    weight?: number;
}
