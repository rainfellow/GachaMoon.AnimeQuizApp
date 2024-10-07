import { useContext } from 'react';
import { CloseButton, Combobox, TextInput, useCombobox } from '@mantine/core';
import { AnimeData } from '@/models/Anime';
import { LocalSettingsContext } from '@/context/local-settings-context';
import { AnimeAutocompleteOptionDisplay, AnimeAutocompleteSettings } from '@/models/GameplaySettings';

interface AnimeFilteredData {
    animeData: AnimeData,
    filteredAnimeString: string
}

function getFilteredOptions(data: AnimeData[], searchQuery: string, limit: number, settings: AnimeAutocompleteSettings) {
  const result: AnimeFilteredData[] = [];

  for (let i = 0; i < data.length; i += 1) {

    if (result.length === limit) {
      break;
    }
    
    let best_alias = '';
    let best_lang_alias = ''
    if (data[i].animeName.toLocaleLowerCase().includes(searchQuery.trim().toLocaleLowerCase())) {
        best_alias = data[i].animeName;
    }
  
    for(let j = 0; j < data[i].aliases.length; j++)
    {
        if (data[i].aliases[j].alias.toLocaleLowerCase().includes(searchQuery.trim().toLocaleLowerCase())) {
            best_alias = data[i].aliases[j].alias.length > best_alias.length ? data[i].aliases[j].alias : best_alias;
        }
        if(data[i].aliases[j].language == settings.autocompleteLanguageCode)
        {
            best_lang_alias = data[i].aliases[j].alias.length > best_lang_alias.length ? data[i].aliases[j].alias : best_lang_alias;
        }
    }

    if (best_lang_alias == '')
    {
      best_lang_alias = data[i].animeName;
    }

    if (best_alias != '')
    {
      switch(settings.autocompleteBehaviour) { 
        case AnimeAutocompleteOptionDisplay.Default: { 
          result.push({animeData: data[i], filteredAnimeString: data[i].animeName});
          break; 
        } 
        case AnimeAutocompleteOptionDisplay.InLanguage: { 
          result.push({animeData: data[i], filteredAnimeString: best_lang_alias});
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

export function AnimeAutocomplete(props: { className: string, data: AnimeData[] | undefined, limit: number, value: string | undefined, onChange: (value: string) => void}) {
  const { animeAutocompleteSettings } = useContext(LocalSettingsContext);
  const defaultFilteredAnime: AnimeFilteredData = {animeData: {aliases: [], animeId: 0, animeName: "", malId: 0}, filteredAnimeString: ""};
  const combobox = useCombobox();
  const filteredOptions = getFilteredOptions(props.data != undefined ? props.data : [], props.value ?? '', props.limit, animeAutocompleteSettings);

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
          value={props.value ?? ''}
          onChange={(event) => {
            event.preventDefault();
            props.onChange(event.currentTarget.value);
            combobox.openDropdown();
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
          {options.length === 0 ? <Combobox.Empty>Nothing found</Combobox.Empty> : options}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
    </div>
  );
}