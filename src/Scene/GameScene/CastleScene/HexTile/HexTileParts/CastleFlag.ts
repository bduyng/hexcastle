import * as THREE from 'three';
import HexTilePartAbstract from './HexTilePartAbstract';
import Materials from '../../../../../Core/Materials/Materials';
import { MaterialType } from '../../../../../Data/Enums/MaterialType';
import ThreeJSHelper from '../../../../../Helpers/ThreeJSHelper';
import { HexTilePartType } from '../../../../../Data/Enums/HexTilePartType';
import { PartsConfig } from '../../../../../Data/Configs/HexTilePartsConfig';
import Loader from '../../../../../Core/Loader/AssetsLoader';
import { FlagVertexShader, FlagFragmentShader } from '../../../../../Core/Materials/Shaders/FlagShader';

export default class CastleFlag extends HexTilePartAbstract {
    private view: THREE.Mesh;
    private config;
    private shaderMaterial: THREE.ShaderMaterial;
    private time: number = 0;
    private viewGroup: THREE.Group;

    constructor(hexTilePartType: HexTilePartType) {
        super(hexTilePartType);

        this.config = PartsConfig[hexTilePartType];

        this.init();
    }

    public update(dt: number): void {
        if (this.shaderMaterial) {
            this.time += dt;
            this.shaderMaterial.uniforms.time.value = this.time;
        }
    }

    public reset(): void {
        if (this.view) {
            this.view.geometry.dispose();
            if (this.shaderMaterial) {
                this.shaderMaterial.dispose();
            }
            this.remove(this.view);
            this.view = null;
        }
    }

    private init(): void {
        this.viewGroup = new THREE.Group();
        this.add(this.viewGroup);

        const geometry: THREE.BufferGeometry = ThreeJSHelper.getGeometryFromModel('flag_blue');
        
        const texture: THREE.Texture = Loader.assets['hexagons_medieval'] as THREE.Texture;
        
        if (texture) {
            this.shaderMaterial = new THREE.ShaderMaterial({
                vertexShader: FlagVertexShader,
                fragmentShader: FlagFragmentShader,
                uniforms: {
                    map: { value: texture },
                    time: { value: 0.0 },
                },
                transparent: true
            });
        }

        const instancedView = this.view = new THREE.InstancedMesh(geometry, this.shaderMaterial, 2);
        this.viewGroup.add(instancedView);

        const matrix = new THREE.Matrix4();

        for (let i = 0; i < 2; i++) {
            const position = new THREE.Vector3(i * 2, 0, 0); // Разместить флаги с интервалом 2 единицы
            const rotationQuaternion = new THREE.Quaternion();
            const scale = new THREE.Vector3(1, 1, 1);

            matrix.compose(position, rotationQuaternion, scale);
            instancedView.setMatrixAt(i, matrix);
        }

        instancedView.instanceMatrix.needsUpdate = true;

        this.viewGroup.position.copy(this.config.viewPosition);
    }
}
