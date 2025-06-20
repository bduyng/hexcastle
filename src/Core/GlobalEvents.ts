// src/Core/EventBus.ts
import mitt, { Emitter } from 'mitt';

export type GlobalEvents = {
  'game:generate': void;
  'game:fieldRadiusChanged': number;
  'ui:sliderPointerDown': void;
  'ui:sliderPointerUp': void;
};

export const GlobalEventBus: Emitter<GlobalEvents> = mitt<GlobalEvents>();