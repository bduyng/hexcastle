import * as THREE from 'three';
import { CameraState } from '../../Data/Enums/CameraState';
import { GlobalEventBus } from '../../Core/GlobalEvents';
import CameraConfig from '../../Data/Configs/Scene/CameraConfig';
import { DefaultWFCConfig } from '../../Data/Configs/WFCConfig';

export default class CameraController extends THREE.Group {
    private camera: THREE.PerspectiveCamera;
    private state: CameraState = CameraState.Free;
    private targetDistance: number;
    private targetPosition: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    private speed: number;

    constructor(camera: THREE.PerspectiveCamera) {
        super();

        this.camera = camera;

        this.init();
    }

    public update(dt: number): void {
        if (this.state === CameraState.MovingToTarget) {
            const currentPosition = this.camera.position;
            const distanceToTarget = currentPosition.distanceTo(this.targetPosition);
            if (distanceToTarget > 0.1) {
                const moveStep = Math.min(distanceToTarget, dt * this.speed);
                this.camera.position.lerp(this.targetPosition, moveStep / distanceToTarget);
            } else {
                this.state = CameraState.Free;
            }
        }
    }

    public moveForTargetRadius(radius: number, instant: boolean = false): void {
        this.state = CameraState.MovingToTarget;
        this.targetDistance = radius * CameraConfig.distanceRadiusCoeff + CameraConfig.distanceRadiusAdd;

        const direction = new THREE.Vector3(0, 0, 1).applyQuaternion(this.camera.quaternion);
        this.targetPosition = new THREE.Vector3(0, 0, 0).add(direction.multiplyScalar(this.targetDistance));

        const currentPosition = this.camera.position;
        const distanceToTarget = currentPosition.distanceTo(this.targetPosition);
        this.speed = distanceToTarget;

        if (instant) {
            this.camera.position.copy(this.targetPosition);
            this.camera.lookAt(new THREE.Vector3(0, 0, 0));
            this.state = CameraState.Free;
        }
    }

    private init(): void {
        const startDistance = 10;
        const startAngleRad = THREE.MathUtils.degToRad(CameraConfig.startAngle);
        this.camera.position.set(0, startDistance * Math.sin(startAngleRad), startDistance * Math.cos(startAngleRad));
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        this.moveForTargetRadius(DefaultWFCConfig.radius, true);
        this.initGlobalEvents();
    }

    private initGlobalEvents(): void {
        GlobalEventBus.on('game:startInteractionOrbitControls', () => {
            if (this.state === CameraState.MovingToTarget) {
                this.state = CameraState.Free;
            }
        });
    }
}
