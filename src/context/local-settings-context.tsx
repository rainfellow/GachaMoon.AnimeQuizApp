import React, { createContext, useCallback, useState } from "react";
import type { ReactElement } from "react";
import { AnimeAutocompleteOptionDisplay, AnimeAutocompleteSettings } from "@/models/GameplaySettings";
import { useLocalStorage } from "@/hooks/use-local-storage";

export interface ILocalSettings {
    colorTheme: string
    animeAutocompleteSettings: AnimeAutocompleteSettings;
    setColorTheme: (colorTheme: string) => void
    setAnimeAutocompleteSettings: (animeAutocompleteSettings: AnimeAutocompleteSettings) => void
}

export const LocalSettingsContext = createContext<ILocalSettings>({
    colorTheme: "dark",
    animeAutocompleteSettings: { autocompleteLanguageCode: 'en', autocompleteBehaviour: AnimeAutocompleteOptionDisplay.Default, highlightText: false },
    setColorTheme: (colorTheme: string) => {},
    setAnimeAutocompleteSettings: (animeAutocompleteSettings: AnimeAutocompleteSettings) => {},

});

interface LocalSettingsProviderProps {
    children: React.ReactNode;
}

export const LocalSettingsContextProvider: React.FC<LocalSettingsProviderProps> = ({
    children
}: LocalSettingsProviderProps): ReactElement => {
    const { getItem, setItem } = useLocalStorage()
    const [colorTheme, setColorTheme] = useState<string>(getItem('color-theme') ?? "dark");
    const autocompleteSettingsString = getItem('autocomplete-settings') ?? '';
    const [animeAutocompleteSettings, setAnimeAutocompleteSettings] = useState<AnimeAutocompleteSettings>(
         autocompleteSettingsString == '' ? { autocompleteLanguageCode: 'en', autocompleteBehaviour: AnimeAutocompleteOptionDisplay.Default, highlightText: false } : JSON.parse(autocompleteSettingsString));

    const contextValue = {
        colorTheme,
        animeAutocompleteSettings,
        setColorTheme: useCallback((colorTheme: string) => {
            setColorTheme(colorTheme);
            setItem('color-theme', colorTheme);
        }, []),
        setAnimeAutocompleteSettings: useCallback((animeAutocompleteSettings: AnimeAutocompleteSettings) => {
            setAnimeAutocompleteSettings(animeAutocompleteSettings);
            setItem('autocomplete-settings', JSON.stringify(animeAutocompleteSettings));
        }, []),
    };
    return (
        <LocalSettingsContext.Provider value={contextValue}>
            {children}
        </LocalSettingsContext.Provider>
    );
};
