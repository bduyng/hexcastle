import * as THREE from 'three';

export default class CanvasPlaneMesh extends THREE.Group {
    private canvas: HTMLCanvasElement;
    private view: THREE.Mesh;
    private width: number;
    private height: number;
    private resolution: number;

    constructor(width: number, height: number, resolution: number) {
        super();

        this.width = width;
        this.height = height;
        this.resolution = resolution;

        this.init();
    }

    public getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }

    public getResolution(): number {
        return this.resolution;
    }

    public getView(): THREE.Mesh {
        return this.view;
    }

    private init(): void {
        const canvas = this.canvas = document.createElement('canvas');

        const canvasWidth = Math.ceil(this.width * this.resolution);
        const canvasHeight = Math.ceil(this.height * this.resolution);

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;

        const planeSize = Math.max(canvasWidth, canvasHeight) / this.resolution;
        const geometry = new THREE.PlaneGeometry(planeSize, planeSize);
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            alphaTest: 0.2,
        });

        const view = this.view = new THREE.Mesh(geometry, material);
        this.add(view);
    }
}
