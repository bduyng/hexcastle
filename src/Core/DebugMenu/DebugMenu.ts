import * as THREE from 'three';
import * as PIXI from 'pixi.js';
import RendererStats from 'three-webgl-stats';
import Stats from 'three/addons/libs/stats.module.js';
import GUIHelper from "./GUIHelper";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { GlobalEventBus } from '../GlobalEvents';
import { DebugConfig } from '../../Data/Configs/Debug/DebugConfig';
import { DefaultWFCConfig } from '../../Data/Configs/WFCConfig';
import { GameConfig } from '../../Data/Configs/GameConfig';
import TWEEN from 'three/addons/libs/tween.module.js';

export default class DebugMenu {
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private pixiApp: PIXI.Application;

    private fpsStats: Stats;
    private rendererStats: RendererStats;
    private orbitControls: OrbitControls;

    private isAssetsLoaded: boolean;

    private radius: number = DefaultWFCConfig.radius * GameConfig.gameField.hexSize * 2;
    private targetTween: any;

    constructor(camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, pixiApp: PIXI.Application) {
        this.camera = camera;
        this.renderer = renderer;
        this.pixiApp = pixiApp;

        this.isAssetsLoaded = false;

        this.init();
    }

    public preUpdate(): void {
        if (DebugConfig.fpsMeter) {
            this.fpsStats.begin();
        }
    }

    public postUpdate(): void {
        if (DebugConfig.fpsMeter) {
            this.fpsStats.end();
        }
    }

    public update(): void {
        if (DebugConfig.orbitControls) {
            this.orbitControls.update();
        }

        if (DebugConfig.rendererStats) {
            this.rendererStats.update(this.renderer);
        }
    }

    public showAfterAssetsLoad(): void {
        this.isAssetsLoaded = true;

        if (DebugConfig.fpsMeter) {
            this.fpsStats.dom.style.visibility = 'visible';
        }

        if (DebugConfig.rendererStats) {
            this.rendererStats.domElement.style.visibility = 'visible';
        }

        if (DebugConfig.orbitControls) {
            this.orbitControls.enabled = true;
        }

        GUIHelper.instance.showAfterAssetsLoad();
    }

    public getOrbitControls(): OrbitControls {
        return this.orbitControls;
    }

    private init(): void {
        this.initRendererStats();
        this.initFPSMeter();
        this.initOrbitControls();

        this.initLilGUIHelper();
        this.initGlobalListeners();
    }

    private initRendererStats(): void {
        if (DebugConfig.rendererStats) {
            const rendererStats = this.rendererStats = new RendererStats();

            rendererStats.domElement.style.position = 'absolute';
            rendererStats.domElement.style.left = '0px';
            rendererStats.domElement.style.bottom = '0px';
            document.body.appendChild(rendererStats.domElement);

            if (!this.isAssetsLoaded) {
                this.rendererStats.domElement.style.visibility = 'hidden';
            }
        }
    }

    private initFPSMeter(): void {
        if (DebugConfig.fpsMeter) {
            const stats = this.fpsStats = new Stats();
            stats.showPanel(0);
            document.body.appendChild(stats.dom);

            if (!this.isAssetsLoaded) {
                this.fpsStats.dom.style.visibility = 'hidden';
            }
        }
    }

    private initOrbitControls(): void {
        const orbitControls = this.orbitControls = new OrbitControls(this.camera, this.pixiApp.renderer.canvas);

        orbitControls.target.set(0, 0, 0);

        orbitControls.enableDamping = true;
        orbitControls.dampingFactor = 0.07;
        orbitControls.rotateSpeed = 1;
        orbitControls.panSpeed = 1;

        orbitControls.minPolarAngle = 0;
        orbitControls.maxPolarAngle = Math.PI / 2;
        orbitControls.minDistance = 3;
        orbitControls.maxDistance = 90;

        orbitControls.enablePan = true;
        orbitControls.screenSpacePanning = false;

        // const maxPanDistance = 5;

        orbitControls.addEventListener('change', () => {
            const target = orbitControls.target;
            const distance = Math.sqrt(target.x * target.x + target.z * target.z);

            if (distance > this.radius) {
                const scale = this.radius / distance;
                target.x *= scale;
                target.z *= scale;
            }
        });

        if (!this.isAssetsLoaded) {
            orbitControls.enabled = false;
        }

        orbitControls.addEventListener('start', () => {
            GlobalEventBus.emit('game:startInteractionOrbitControls');
        });
    }

    private initLilGUIHelper(): void {
        new GUIHelper();
    }

    private initGlobalListeners(): void {
        GlobalEventBus.on('ui:sliderPointerDown', () => {
            this.orbitControls.enabled = false;
        });

        GlobalEventBus.on('ui:sliderPointerUp', () => {
            this.orbitControls.enabled = true;
        });

        GlobalEventBus.on('game:generateStarted', () => {
            this.radius = DefaultWFCConfig.radius * GameConfig.gameField.hexSize * 2;
            this.moveOrbitTargetToCenter();
        });
    }

    private moveOrbitTargetToCenter(): void {
        if (this.targetTween) {
            this.targetTween.stop();
        }

        this.targetTween = new TWEEN.Tween(this.orbitControls.target)
            .to({ x: 0, z: 0 }, 300)
            .easing(TWEEN.Easing.Sinusoidal.In)
            .start()
            .onUpdate(() => {
                this.orbitControls.update();
            })
            .onComplete(() => {
                this.orbitControls.target.set(0, 0, 0);
                this.orbitControls.update();
            });
    }

    // private onFpsMeterClick(): void {
    //   if (DebugConfig.fpsMeter) {
    //     if (!this.fpsStats) {
    //       this.initFPSMeter();
    //     }
    //     this.fpsStats.dom.style.display = 'block';
    //   } else {
    //     this.fpsStats.dom.style.display = 'none';
    //   }
    // }

    // private onRendererStatsClick(rendererStatsState): void {
    //   if (DebugConfig.rendererStats) {
    //     if (rendererStatsState) {
    //       if (!this.rendererStats) {
    //         this.initRendererStats();
    //       }

    //       this.rendererStats.domElement.style.display = 'block';
    //     } else {
    //       this.rendererStats.domElement.style.display = 'none';
    //     }
    //   }
    // }

    // private onOrbitControlsClick(orbitControlsState): void {
    //   if (orbitControlsState) {
    //     if (!this.orbitControls) {
    //       this.initOrbitControls();
    //     }

    //     this.orbitControls.enabled = true;
    //   } else {
    //     this.orbitControls.enabled = false;
    //   }
    // }
}
