import * as THREE from 'three';
import { IHexCoord } from '../Data/Interfaces/IHexTile';
import HexGridHelper from './HexGridHelper';
import { GameConfig } from '../Data/Configs/GameConfig';
import { GridOrientation } from '../Data/Enums/GridOrientation';

export interface IHexClickEvent {
    hexCoord: IHexCoord;
    worldPosition: THREE.Vector3;
}

export default class MouseInteractionHelper {
    private camera: THREE.Camera;
    private scene: THREE.Scene;
    private raycaster: THREE.Raycaster;
    private mouse: THREE.Vector2;
    private canvas: HTMLElement;
    private onHexClickCallback: (event: IHexClickEvent) => void;

    constructor(camera: THREE.Camera, scene: THREE.Scene, canvas: HTMLElement) {
        this.camera = camera;
        this.scene = scene;
        this.canvas = canvas;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.init();
    }

    public setOnHexClick(callback: (event: IHexClickEvent) => void): void {
        this.onHexClickCallback = callback;
    }

    public destroy(): void {
        this.canvas.removeEventListener('click', this.onMouseClick);
    }

    private init(): void {
        this.canvas.addEventListener('click', this.onMouseClick.bind(this));
    }

    private onMouseClick(event: MouseEvent): void {
        // Calculate mouse position in normalized device coordinates (-1 to +1)
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        // Update the raycaster with the camera and mouse position
        this.raycaster.setFromCamera(this.mouse, this.camera);

        // Create a plane at y=0 for hex grid intersection
        const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const intersectionPoint = new THREE.Vector3();
        
        if (this.raycaster.ray.intersectPlane(plane, intersectionPoint)) {
            const hexCoord = this.worldToHexCoord(intersectionPoint);
            
            if (this.onHexClickCallback) {
                this.onHexClickCallback({
                    hexCoord,
                    worldPosition: intersectionPoint
                });
            }
        }
    }

    private worldToHexCoord(worldPosition: THREE.Vector3): IHexCoord {
        const size = GameConfig.gameField.hexSize;
        
        // Convert from world coordinates to axial coordinates
        // This is the inverse of HexGridHelper.axialToWorld
        const x = worldPosition.x;
        const z = worldPosition.z;
        
        let q: number, r: number;
        
        if (GameConfig.gameField.GridOrientation === GridOrientation.PointyTop) {
            q = (Math.sqrt(3) / 3 * x - 1 / 3 * z) / size;
            r = (2 / 3 * z) / size;
        } else { // FlatTop
            q = (2 / 3 * x) / size;
            r = (-1 / 3 * x + Math.sqrt(3) / 3 * z) / size;
        }
        
        // Round to nearest hex coordinate
        return this.roundToHexCoord(q, r);
    }

    private roundToHexCoord(q: number, r: number): IHexCoord {
        // Convert to cube coordinates for proper rounding
        const s = -q - r;
        
        let rq = Math.round(q);
        let rr = Math.round(r);
        let rs = Math.round(s);
        
        const qDiff = Math.abs(rq - q);
        const rDiff = Math.abs(rr - r);
        const sDiff = Math.abs(rs - s);
        
        if (qDiff > rDiff && qDiff > sDiff) {
            rq = -rr - rs;
        } else if (rDiff > sDiff) {
            rr = -rq - rs;
        }
        
        return { q: rq, r: rr };
    }
}