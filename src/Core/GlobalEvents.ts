// src/Core/EventBus.ts
import mitt, { Emitter } from 'mitt';

export type GlobalEvents = {
    'game:generate': void;
    'game:stopGenerate': void;
    'game:fieldRadiusChanged': number;
    'game:startGeneratingWorld': void;
    'game:progressGeneratingWorld': number;
    'game:finishGeneratingWorld': void;
    'game:startInteractionOrbitControls': void;
    'game:generateStarted': number;

    'ui:sliderPointerDown': void;
    'ui:sliderPointerUp': void;
};

export const GlobalEventBus: Emitter<GlobalEvents> = mitt<GlobalEvents>();