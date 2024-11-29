import { LocalSettingsContext } from "@/context/local-settings-context";
import { useAnimeBase } from "@/hooks/use-anime-base";
import { AnimeData } from "@/models/Anime";
import { AnimeAutocompleteOptionDisplay } from "@/models/GameplaySettings";
import { Button, Stack, Text } from "@mantine/core";
import { useContext, useEffect } from "react";

interface AnimeOption {
    animeData: AnimeData,
    displayText: string,
    selected: boolean,
}

export function AnimeOptionSelector(props: { options: number[], selectedOptions: number[], maxSelect: number, onChange: (selectedOptions: number[]) => void }) {

    const { getAnimeFromId } = useAnimeBase()  
    const { animeAutocompleteSettings } = useContext(LocalSettingsContext);

    const animeOptions: AnimeOption[] = props.options.map((x) => getAnimeOption(x)).filter((x) => x != undefined);

    const getAnimeOption = (animeId: number) => {
        let anime = getAnimeFromId(animeId);
        if (anime == undefined)
        {
            return;
        }
        let isSelected = props.selectedOptions.findIndex((x) => x == animeId) != -1;
        switch(animeAutocompleteSettings.autocompleteBehaviour) { 
            case AnimeAutocompleteOptionDisplay.Default: { 
              return { displayText: anime.animeName, animeData: anime, selected: isSelected };
            } 
            case AnimeAutocompleteOptionDisplay.InLanguage: { 
              let alias = anime.aliases.find((x) => x.language == animeAutocompleteSettings.autocompleteLanguageCode);
              return { displayText: alias == undefined ? anime.animeName : alias.alias, animeData: anime, selected: isSelected };
            } 
            case AnimeAutocompleteOptionDisplay.Closest: { 
                let alias = anime.aliases.find((x) => x.language == animeAutocompleteSettings.autocompleteLanguageCode);
                return { displayText: alias == undefined ? anime.animeName : alias.alias, animeData: anime, selected: isSelected };
            } 
            default: { 
               return;
            } 
         } 
    }

    const handleOptionUpdate = (index: number) => {
        let totalSelected = animeOptions.filter((x) => x.selected).length;
        if (!animeOptions[index].selected && totalSelected >= props.maxSelect)
        {
            return;
        }
        animeOptions[index].selected = !animeOptions[index].selected;
        props.onChange(animeOptions.filter((x) => x.selected).map((x) => x.animeData.animeId));
    }

    return (
        <Stack
            w={400}
            align="stretch"
            justify="center"
            gap="md">
            {animeOptions.map((option, index) => 
                <Button variant="default" onClick={() => handleOptionUpdate(index)}>
                    <Text color={option.selected ? "green" : "dimmed"}>{option!.displayText}</Text>
                </Button>)} 
        </Stack>
    )
}