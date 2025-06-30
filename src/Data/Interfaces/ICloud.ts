import { CloudState } from "../Enums/CloudsState";
import { CloudType } from "../Enums/CloudType";

export interface IClouds {
    type: CloudType;
    index: number;
    speed: number;
    scale: number;
    tween: any;
    edgeTween: any;
    state: CloudState;
}
