import { ButtonType } from "../Data/Enums/ButtonType";
import { ButtonConfig } from "../Data/Configs/ButtonsConfig";
import { GlobalEventBus } from "./GlobalEvents";

export class KeyboardController {
    constructor() {

        this.init();
    }

    private init(): void {
        window.addEventListener("keydown", (event) => this.onPressDownSignal(event));
    }

    private onPressDownSignal(event: KeyboardEvent): void {
        for (const value in ButtonType) {
            const buttonType = ButtonType[value];
            const config = ButtonConfig[buttonType];

            if (config.keyCode && config.keyCode.includes(event.code)) {
                GlobalEventBus.emit('game:pressKey', buttonType);
            }
        }
    }
}
