import * as THREE from 'three';

export default class CameraController extends THREE.Group {
    private camera: THREE.PerspectiveCamera;

    constructor(camera: THREE.PerspectiveCamera) {
        super();

        this.camera = camera;

        this.init();
    }

    public update(): void {

    }

    private init(): void {
        this.camera.position.set(0, 16, 12);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    }
}
