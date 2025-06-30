import * as THREE from 'three';
import HexTilePartAbstract from './HexTilePartAbstract';
import Materials from '../../../../../Core/Materials/Materials';
import { MaterialType } from '../../../../../Data/Enums/MaterialType';
import ThreeJSHelper from '../../../../../Helpers/ThreeJSHelper';
import { HexTilePartType } from '../../../../../Data/Enums/HexTilePartType';
import { PartsConfig } from '../../../../../Data/Configs/HexTilePartsConfig';

export default class WindmillBlades extends HexTilePartAbstract {
    private view: THREE.Mesh;
    private config;
    private speed: number;

    constructor(hexTilePartType: HexTilePartType) {
        super(hexTilePartType);

        this.config = PartsConfig[hexTilePartType];

        this.init();
    }

    public update(dt: number): void {
        if (this.view) {
            this.view.rotation.z += dt * this.speed;
        }
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
        const geometry: THREE.BufferGeometry = ThreeJSHelper.getGeometryFromModel('building_windmill_top_fan');

        const view: THREE.Mesh = this.view = new THREE.Mesh(geometry, material);
        this.add(view);

        view.position.copy(this.config.viewPosition);

        this.speed = THREE.MathUtils.randFloat(this.config.speed.min, this.config.speed.max);
    }
}
