// src/Core/EventBus.ts
import mitt, { Emitter } from 'mitt';

export type GlobalEvents = {
  'game:generate': void;
  'game:fieldRadiusChanged': number;
};

export const GlobalEventBus: Emitter<GlobalEvents> = mitt<GlobalEvents>();