import { AnimeAutocompleteOptionDisplay } from '@/models/GameplaySettings';
import { Popover, ActionIcon, rem, Radio, Stack, Group } from '@mantine/core';
import { useContext, useState } from 'react';
import { CiSettings } from 'react-icons/ci';
import { LanguagePicker } from '../LanguagePicker/LanguagePicker';
import { LocalSettingsContext } from '@/context/local-settings-context';
import { HoverHelper } from '../HoverHelper/HoverHelper';

export function AnimeAutocompleteConfig() {
    const [opened, setOpened] = useState(false);
    const { animeAutocompleteSettings, setAnimeAutocompleteSettings } = useContext(LocalSettingsContext);
    const [selectedAutocompleteBehaviour, setSelectedAutocompleteBehaviour] = useState(animeAutocompleteSettings.autocompleteBehaviour)
    const [selectedAnimeAutocompleteLanguage, setSelectedAnimeAutocompleteLanguage] = useState(animeAutocompleteSettings.autocompleteLanguageCode)
    const [selectedTextHighlight, setSelectedTextHighlight] = useState(animeAutocompleteSettings.highlightText)

    const handleAutocompleteBehaviourOptionChanged = (value: string) => {
        setSelectedAutocompleteBehaviour(value as AnimeAutocompleteOptionDisplay);
        setAnimeAutocompleteSettings({ autocompleteBehaviour: value as AnimeAutocompleteOptionDisplay, autocompleteLanguageCode: selectedAnimeAutocompleteLanguage, highlightText: selectedTextHighlight })
    }


    const handlePopoverChange = () => {
        if (opened) {
            setAnimeAutocompleteSettings({ autocompleteBehaviour: selectedAutocompleteBehaviour, autocompleteLanguageCode: selectedAnimeAutocompleteLanguage, highlightText: selectedTextHighlight })
        }
        setOpened((value) => !value);
    }  

    const handleAnimeDefaultLanguageChange = (language: string) => {
        setSelectedAnimeAutocompleteLanguage(language);
        setAnimeAutocompleteSettings({ autocompleteBehaviour: selectedAutocompleteBehaviour, autocompleteLanguageCode: language, highlightText: selectedTextHighlight })
    }

    return (
    <Popover trapFocus position="right-start" withArrow shadow="md" opened={opened}>
        <Popover.Target>
            <ActionIcon
            size={42}
            variant="default"
            aria-label="Configure gameplay settings"
            onClick={() => { handlePopoverChange() }}
            >
            <CiSettings style={{ width: rem(22), height: rem(22) }} />
            </ActionIcon>
        </Popover.Target>
        <Popover.Dropdown>
            <Stack justify='flex-start'>
                <Radio.Group
                value={selectedAutocompleteBehaviour}
                onChange={handleAutocompleteBehaviourOptionChanged}
                name=""
                description="Configure Autocomplete Behaviour"
            >
                <Stack mt="xs">
                <Group justify='flex-start'>
                    <Radio value={AnimeAutocompleteOptionDisplay.Default} label="Default" />
                    <HoverHelper displayedText="When typing an answer, displayed options will use that anime's default title, provided by MyAnimeList."/>
                </Group>
                <Group justify='flex-start'>
                    <Radio value={AnimeAutocompleteOptionDisplay.InLanguage} label="Use Set Language" />
                    <HoverHelper displayedText="When typing an answer, displayed options will always be in the selected language. If no title in that language is present for an anime, the official title will be displayed instead."/>
                </Group>
                </Stack>
                </Radio.Group>
                { selectedAutocompleteBehaviour == AnimeAutocompleteOptionDisplay.InLanguage && <LanguagePicker selectedCode={animeAutocompleteSettings.autocompleteLanguageCode} onLanguageSelected={handleAnimeDefaultLanguageChange}/> }
            </Stack>
        </Popover.Dropdown>
    </Popover>
  );
}