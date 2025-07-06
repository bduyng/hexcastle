import * as THREE from 'three';
import HexTilePartAbstract from './HexTilePartAbstract';
import Materials from '../../../../../Core/Materials/Materials';
import { MaterialType } from '../../../../../Data/Enums/MaterialType';
import ThreeJSHelper from '../../../../../Helpers/ThreeJSHelper';
import { HexTilePartType } from '../../../../../Data/Enums/HexTilePartType';
import { PartsConfig } from '../../../../../Data/Configs/HexTilePartsConfig';

export default class CastleFlag extends HexTilePartAbstract {
    private view: THREE.Mesh;
    private config;

    constructor(hexTilePartType: HexTilePartType) {
        super(hexTilePartType);

        this.config = PartsConfig[hexTilePartType];

        this.init();
    }

    public update(dt: number): void {

    }

    public reset(): void {
        if (this.view) {
            this.view.geometry.dispose();
            this.remove(this.view);
            this.view = null;
        }
    }

    private init(): void {
        const material: THREE.Material = Materials.getInstance().materials[MaterialType.Main];
        const geometry: THREE.BufferGeometry = ThreeJSHelper.getGeometryFromModel('flag_blue');

        const view: THREE.Mesh = this.view = new THREE.Mesh(geometry, material);
        this.add(view);

        view.position.copy(this.config.viewPosition);
        view.rotation.z = Math.PI / 2;
    }
}
