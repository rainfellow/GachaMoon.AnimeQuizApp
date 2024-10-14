import { GameConfiguration } from "./GameConfiguration";

export interface AnimeAutocompleteSettings {
    highlightText: boolean;
    autocompleteBehaviour: AnimeAutocompleteOptionDisplay;
    autocompleteLanguageCode: string;
}

export enum AnimeAutocompleteOptionDisplay {
    Default = "Default",
    InLanguage = "UseLang",
    Closest = "Closest"
}

export interface LocalGameSettingsPresets {
    presets: Map<string, GameConfiguration>;
}

export class JSONAbleMap extends Map {
    toJSON() {
      return [...this.entries()]
    }
  }