import * as THREE from 'three';
import { MaterialType } from '../../Data/Enums/MaterialType';
import Loader from '../Loader/AssetsLoader';

export default class Materials {
    static instance: Materials;

    materials: { [key in MaterialType]?: THREE.Material } = {};

    private constructor() {
        this.initMaterials();
    }

    public static getInstance(): Materials {
        if (!Materials.instance) {
            Materials.instance = new Materials();
        }
        return Materials.instance;
    }

    private initMaterials(): void {
        this.initMainMaterial();
        this.initTransparentMaterial();
        this.initTileDebugMaterials();
    }

    private initMainMaterial(): void {
        const texture: THREE.Texture = Loader.assets['hexagons_medieval'] as THREE.Texture;
        texture.flipY = false;
        texture.colorSpace = THREE.SRGBColorSpace;

        this.materials[MaterialType.Main] = new THREE.MeshLambertMaterial({
            map: texture,
        });
    }

    private initTransparentMaterial(): void {
        this.materials[MaterialType.Transparent] = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.1,
            depthWrite: false,
        });
    }

    private initTileDebugMaterials(): void {
        this.materials[MaterialType.TileDebugGreen] = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            transparent: true,
            opacity: 0.5,
            depthWrite: false,
        });

        this.materials[MaterialType.TileDebugRed] = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            transparent: true,
            opacity: 0.5,
            depthWrite: false,
        });
    }
}

Materials.instance = null;
