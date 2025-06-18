// src/Core/EventBus.ts
import mitt, { Emitter } from 'mitt';

export type GlobalEvents = {
  'game:generate': void;
  'game:stateChanged': string;
  'audio:mute': boolean;
  'ui:showMenu': string;
  // добавляйте по необходимости
};

export const GlobalEventBus: Emitter<GlobalEvents> = mitt<GlobalEvents>();