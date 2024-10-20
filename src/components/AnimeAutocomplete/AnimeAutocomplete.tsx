import { useContext } from 'react';
import { CloseButton, Combobox, TextInput, useCombobox } from '@mantine/core';
import { AnimeData } from '@/models/Anime';
import { LocalSettingsContext } from '@/context/local-settings-context';
import { AnimeAutocompleteOptionDisplay, AnimeAutocompleteSettings } from '@/models/GameplaySettings';
import { useTranslation } from 'react-i18next';

interface AnimeFilteredData {
    animeData: AnimeData,
    filteredAnimeString: string
}

function getFilteredOptions(data: AnimeData[], searchQuery: string, limit: number, settings: AnimeAutocompleteSettings) {
  const result: AnimeFilteredData[] = [];
  if (searchQuery.length < 3 && settings.autocompleteBehaviour == AnimeAutocompleteOptionDisplay.Closest)
  {
    return result;
  }
  for (let i = 0; i < data.length; i += 1) {

    if (result.length === limit) {
      break;
    }
    let eligible = data[i].animeName.trim().toLocaleLowerCase().includes(searchQuery.trim().toLocaleLowerCase());
    let best_alias = '';
    let best_alias_is_language = false;
    let longest_lang_alias = '';
  
    for(let j = 0; j < data[i].aliases.length; j++)
    {
        let aliasIncludesString = data[i].aliases[j].alias.trim().toLocaleLowerCase().includes(searchQuery.trim().toLocaleLowerCase());
        let aliasIsSelectedLanguage = data[i].aliases[j].language == settings.autocompleteLanguageCode;
        eligible = eligible || aliasIncludesString;
        if (aliasIsSelectedLanguage)
        {
            longest_lang_alias = data[i].aliases[j].alias.length > longest_lang_alias.length ? data[i].aliases[j].alias : longest_lang_alias;
        }
        if(!best_alias_is_language && aliasIncludesString && !aliasIsSelectedLanguage)
        {
          best_alias = data[i].aliases[j].alias.length > best_alias.length ? data[i].aliases[j].alias : best_alias;
        }
        if (aliasIncludesString && aliasIsSelectedLanguage)
        {
          best_alias = data[i].aliases[j].alias.length > best_alias.length ? data[i].aliases[j].alias : best_alias;
          best_alias_is_language = true;
        }
    }

    if (eligible)
    {
      if (longest_lang_alias == '')
      {
        longest_lang_alias = data[i].animeName;
      }
      if (best_alias == '')
      {
        best_alias = data[i].animeName;
      }

      switch(settings.autocompleteBehaviour) { 
        case AnimeAutocompleteOptionDisplay.Default: { 
          result.push({animeData: data[i], filteredAnimeString: data[i].animeName});
          break; 
        } 
        case AnimeAutocompleteOptionDisplay.InLanguage: { 
          result.push({animeData: data[i], filteredAnimeString: longest_lang_alias});
          break; 
        } 
        case AnimeAutocompleteOptionDisplay.Closest: { 
          result.push({animeData: data[i], filteredAnimeString: best_alias});
          break; 
        } 
        default: { 
           break; 
        } 
     } 
    }
  }

  return result;
}

export function AnimeAutocomplete(props: { className: string, data: AnimeData[] | undefined, limit: number, value: string | undefined, onChange: (value: string) => void, onEnterPress: (value: string) => void }) {
  const { animeAutocompleteSettings } = useContext(LocalSettingsContext);
  const defaultFilteredAnime: AnimeFilteredData = {animeData: {aliases: [], animeId: 0, animeName: "", malId: 0, releaseDate: "", meanScore: 0, ageRating: "", animeType: "", episodeCount: 0}, filteredAnimeString: ""};
  const combobox = useCombobox();
  const filteredOptions = getFilteredOptions(props.data != undefined ? props.data : [], props.value ?? '', props.limit, animeAutocompleteSettings);
  const { t } = useTranslation('game');

  const options = filteredOptions.map((item) => (
    <Combobox.Option value={item.filteredAnimeString} key={item.animeData.animeId}>
      {item.filteredAnimeString}
    </Combobox.Option>
  ));

  return (
    <div className={props.className}>
    <Combobox
      onOptionSubmit={(optionValue) => {
        props.onChange(optionValue)
        combobox.closeDropdown();
      }}
      withinPortal={false}
      store={combobox}
    >
      <Combobox.Target>
        <TextInput
          id='anime_input_1'
          value={props.value ?? ''}
          onChange={(event) => {
            event.preventDefault();
            props.onChange(event.currentTarget.value);
            combobox.openDropdown();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
                props.onEnterPress(props.value ?? '');
            }
        }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => combobox.openDropdown()}
          onBlur={() => combobox.closeDropdown()}
          rightSection={
            props.value !== '' && (
              <CloseButton
                size="sm"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => { props.onChange('') }}
                aria-label="Clear value"
              />
            )
          }
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          {options.length === 0 ? <Combobox.Empty>{t('AnimeAutocompleteEmptyLabel')}</Combobox.Empty> : options}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
    </div>
  );
}