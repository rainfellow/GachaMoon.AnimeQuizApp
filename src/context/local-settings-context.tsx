import React, { createContext, useCallback, useState } from "react";
import type { ReactElement } from "react";
import { AnimeAutocompleteOptionDisplay, AnimeAutocompleteSettings } from "@/models/GameplaySettings";
import { useLocalStorage } from "@/hooks/use-local-storage";

export interface ILocalSettings {
    colorTheme: string
    animeAutocompleteSettings: AnimeAutocompleteSettings;
    language: string;
    volume: number;
    setColorTheme: (colorTheme: string) => void
    setAnimeAutocompleteSettings: (animeAutocompleteSettings: AnimeAutocompleteSettings) => void
    setLanguage: (language: string) => void
    setVolume: (volume: number) => void;
}

export const LocalSettingsContext = createContext<ILocalSettings>({
    colorTheme: "dark",
    animeAutocompleteSettings: { autocompleteLanguageCode: 'en', autocompleteBehaviour: AnimeAutocompleteOptionDisplay.Default, highlightText: false },
    language: "en",
    volume: 50,
    setColorTheme: (colorTheme: string) => {},
    setAnimeAutocompleteSettings: (animeAutocompleteSettings: AnimeAutocompleteSettings) => {},
    setLanguage: (language: string) => {},
    setVolume: (volume: number) => {},


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
    const [volume, setVolume] = useState<number>(parseInt(getItem('volume') ?? '50') ?? 50);
    const autocompleteSettingsString = getItem('autocomplete-settings') ?? '';
    const [animeAutocompleteSettings, setAnimeAutocompleteSettings] = useState<AnimeAutocompleteSettings>(
         autocompleteSettingsString == '' ? { autocompleteLanguageCode: 'en', autocompleteBehaviour: AnimeAutocompleteOptionDisplay.Default, highlightText: false } : JSON.parse(autocompleteSettingsString));

    const contextValue = {
        colorTheme,
        animeAutocompleteSettings,
        language,
        volume,
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
        setVolume: useCallback((volume: number) => {
            setVolume(volume);
            setItem('volume', volume.toString());
        }, []),
    };
    return (
        <LocalSettingsContext.Provider value={contextValue}>
            {children}
        </LocalSettingsContext.Provider>
    );
};
