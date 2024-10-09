import React, { createContext, useCallback, useState } from "react";
import type { ReactElement } from "react";
import { AnimeAutocompleteOptionDisplay, AnimeAutocompleteSettings } from "@/models/GameplaySettings";
import { useLocalStorage } from "@/hooks/use-local-storage";

export interface ILocalSettings {
    colorTheme: string
    animeAutocompleteSettings: AnimeAutocompleteSettings;
    language: string;
    setColorTheme: (colorTheme: string) => void
    setAnimeAutocompleteSettings: (animeAutocompleteSettings: AnimeAutocompleteSettings) => void
    setLanguage: (language: string) => void
}

export const LocalSettingsContext = createContext<ILocalSettings>({
    colorTheme: "dark",
    animeAutocompleteSettings: { autocompleteLanguageCode: 'en', autocompleteBehaviour: AnimeAutocompleteOptionDisplay.Default, highlightText: false },
    language: "en",
    setColorTheme: (colorTheme: string) => {},
    setAnimeAutocompleteSettings: (animeAutocompleteSettings: AnimeAutocompleteSettings) => {},
    setLanguage: (language: string) => {},

});

interface LocalSettingsProviderProps {
    children: React.ReactNode;
}

export const LocalSettingsContextProvider: React.FC<LocalSettingsProviderProps> = ({
    children
}: LocalSettingsProviderProps): ReactElement => {
    const { getItem, setItem } = useLocalStorage()
    const [colorTheme, setColorTheme] = useState<string>(getItem('color-theme') ?? "dark");
    const [language, setLanguage] = useState<string>(getItem('language') ?? "en");
    const autocompleteSettingsString = getItem('autocomplete-settings') ?? '';
    const [animeAutocompleteSettings, setAnimeAutocompleteSettings] = useState<AnimeAutocompleteSettings>(
         autocompleteSettingsString == '' ? { autocompleteLanguageCode: 'en', autocompleteBehaviour: AnimeAutocompleteOptionDisplay.Default, highlightText: false } : JSON.parse(autocompleteSettingsString));

    const contextValue = {
        colorTheme,
        animeAutocompleteSettings,
        language,
        setColorTheme: useCallback((colorTheme: string) => {
            setColorTheme(colorTheme);
            setItem('color-theme', colorTheme);
        }, []),
        setAnimeAutocompleteSettings: useCallback((animeAutocompleteSettings: AnimeAutocompleteSettings) => {
            setAnimeAutocompleteSettings(animeAutocompleteSettings);
            setItem('autocomplete-settings', JSON.stringify(animeAutocompleteSettings));
        }, []),
        setLanguage: useCallback((language: string) => {
            setLanguage(language);
            setItem('language', language);
        }, []),
    };
    return (
        <LocalSettingsContext.Provider value={contextValue}>
            {children}
        </LocalSettingsContext.Provider>
    );
};
