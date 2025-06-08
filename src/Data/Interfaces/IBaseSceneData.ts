import * as THREE from 'three';
import * as PIXI from 'pixi.js';
import { GroundCellType } from '../Enums/GroundCellType';
import { EdgeType } from '../Enums/EdgeType';

export interface ILibrariesData {
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    ambientLight: THREE.AmbientLight;
    directionalLight: THREE.DirectionalLight;
    pixiApp: PIXI.Application;
}

export interface IWindowSizes {
    width: number;
    height: number;
}

export interface ICellRules {
    type: GroundCellType;
    edges: EdgeType[];
    weight: number;
}
