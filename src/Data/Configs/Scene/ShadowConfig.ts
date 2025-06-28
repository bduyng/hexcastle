import * as THREE from 'three';

const ShadowConfig = {
    enabled: true,
    type: THREE.PCFSoftShadowMap,
    size: 2048,
    cameraNear: 1,
    cameraFar: 40,
    cameraSize: 42,
}

export default ShadowConfig;
