import * as THREE from 'three';
import Materials from '../../../Core/Materials/Materials';
import { MaterialType } from '../../../Data/Enums/MaterialType';
import ThreeJSHelper from '../../../Helpers/ThreeJSHelper';
import { GameConfig } from '../../../Data/Configs/GameConfig';
import { CloudsState } from '../../../Data/Enums/CloudsState';
import TWEEN from 'three/addons/libs/tween.module.js';

export default class Clouds extends THREE.Group {
    private cloudInstanceType1: THREE.InstancedMesh;
    private type1ActiveCount: number;
    private movingVector: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    private maxDistance: number;
    private speed: number = 5;

    private state: CloudsState = CloudsState.Hided;

    constructor() {
        super();

        setTimeout(() => {
            this.show();
        }, 2000); // Delay to ensure the scene is ready

        this.init();
    }

    public update(dt: number): void {
        if (this.state !== CloudsState.Moving) {
            return;
        }

        for (let i = 0; i < this.type1ActiveCount; i++) {
            const vectorDelta = this.movingVector.clone().multiplyScalar(dt * this.speed);
            ThreeJSHelper.addInstancePosition(this.cloudInstanceType1, i, vectorDelta);

           
        }
    }

    public show(): void {
        this.state = CloudsState.Showing;

        const angle = 30;
        const angleRadians = angle * (Math.PI / 180);
        this.movingVector.x = Math.cos(angleRadians);
        this.movingVector.z = Math.sin(angleRadians);

        const radius = GameConfig.gameField.radius.default;
        this.maxDistance = radius * GameConfig.gameField.hexSize * 2;

        this.type1ActiveCount = 5;

        this.setCloudsStartPosition();

        for (let i = 0; i < this.type1ActiveCount; i++) {
            this.showCloud(this.cloudInstanceType1, i);
        }
    }

    private setCloudsStartPosition(): void {
        for (let i = 0; i < this.type1ActiveCount; i++) {
            this.setCloudStartPosition(this.cloudInstanceType1, i);
        }
    }

    private setCloudStartPosition(instance: THREE.InstancedMesh, index: number): void {
        const randomAngle = Math.random() * 2 * Math.PI; // Random angle in radians
        const randomRadius = Math.random() * this.maxDistance; // Random radius within the maxDistance
        const randomX = randomRadius * Math.cos(randomAngle);
        const randomZ = randomRadius * Math.sin(randomAngle);
        const position = new THREE.Vector3(randomX, 5, randomZ);

        const rotationYAngle = Math.atan2(this.movingVector.x, this.movingVector.z) + Math.PI / 2;
        const rotationQuaternion = new THREE.Quaternion();
        rotationQuaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotationYAngle);

        ThreeJSHelper.updateInstanceTransform(instance, index, position, rotationQuaternion, new THREE.Vector3(0.001, 0.001, 0.001));
    }

    private showCloud(instance: THREE.InstancedMesh, index: number): void {
        const scale = { value: 0.001 };

        new TWEEN.Tween(scale)
            .to({ value: 1 }, 300)
            .easing(TWEEN.Easing.Back.Out)
            .start()
            .onUpdate(() => {
                ThreeJSHelper.updateInstanceTransform(instance, index, undefined, undefined, new THREE.Vector3(scale.value, scale.value, scale.value));
            })
            .onComplete(() => {
                ThreeJSHelper.updateInstanceTransform(instance, index, undefined, undefined, new THREE.Vector3(1, 1, 1));
                this.state = CloudsState.Moving;
            });
    }

    private init(): void {
        const cloudBigInstance = this.cloudInstanceType1 = this.initCloud('cloud_big');
        this.add(cloudBigInstance);
    }

    private initCloud(modelName: string): THREE.InstancedMesh {
        const hideScale: number = 0.001;
        const material: THREE.Material = Materials.getInstance().materials[MaterialType.Main];

        const geometry: THREE.BufferGeometry = ThreeJSHelper.getGeometryFromModel(modelName);

        const instanceCount: number = 10;
        const instanceMesh = new THREE.InstancedMesh(geometry, material, instanceCount);

        instanceMesh.frustumCulled = false;

        const matrix = new THREE.Matrix4();

        for (let i = 0; i < instanceCount; i++) {
            const position = new THREE.Vector3(0, 5, 0);
            const rotationYAngle = 0;
            const rotationQuaternion = new THREE.Quaternion();
            rotationQuaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), rotationYAngle);
            const scale = new THREE.Vector3(hideScale, hideScale, hideScale);

            matrix.compose(position, rotationQuaternion, scale);

            instanceMesh.setMatrixAt(i, matrix);
        }

        instanceMesh.instanceMatrix.needsUpdate = true;
        instanceMesh.castShadow = true;

        return instanceMesh;
    }
}
