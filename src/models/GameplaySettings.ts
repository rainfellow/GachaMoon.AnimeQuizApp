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