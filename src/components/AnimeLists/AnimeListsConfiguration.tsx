import React, { useEffect, useState } from 'react'
import { Loader, SegmentedControl, Stack, Text } from '@mantine/core';
import AnimeListDetails from './AnimeListDetails';
import { AnimeListUpdateResponse } from '@/models/AnimeLists';
import { useTranslation } from 'react-i18next';
import { useAnimeBase } from '@/hooks/use-anime-base';
import { UserAnimeListData } from '@/models/Anime';

const AnimeListsConfiguration = () => {
    const [animeListProviderValue, setAnimeListProviderValue] = useState('none');
    const { loadUserAnimeList } = useAnimeBase();
    const [animeListData, setAnimeListData] = useState<UserAnimeListData>({ animeListServiceProvider: 'NotLoaded', animeListUserId: "", userAnimes: [], selectedAnimeGroups: []});
    const [animeListUpdateResult, setAnimeListUpdateResult] = useState({externalServiceUserId: '', animeCount: 0});
    const { t } = useTranslation('settings');

    const animeListUpdateResultReceived = (response: AnimeListUpdateResponse) => {
      setAnimeListUpdateResult(response);
    }
  
    useEffect(() => {
      loadUserAnimeList().then((data: UserAnimeListData) => {
          setAnimeListData(data)
          setAnimeListProviderValue(data.animeListServiceProvider)
      })
  }, [animeListUpdateResult])

  return (
    <>
      { 
      (animeListData.animeListServiceProvider == 'NotLoaded') ? 
        <Loader/> :
          <Stack justify='center'>
            <Text>{t('AnimeListProviderMainLabel')}</Text>
            <SegmentedControl
                value={animeListProviderValue}
                onChange={setAnimeListProviderValue}
                data={[
                { label: 'None', value: 'None' },
                { label: 'MyAnimeList', value: 'MyAnimeList' },
                { label: 'Anilist', value: 'Anilist' },
                { label: 'Shikimori', value: 'Shikimori' },
                { label: 'Custom', value: 'Custom', disabled: true },
                ]}
            />
            {animeListProviderValue != 'None'
              ? <AnimeListDetails provider={animeListProviderValue} animeListUser={animeListData.animeListUserId} animeListUpdateResult={animeListUpdateResult} setAnimeListUpdateResult={animeListUpdateResultReceived} selectedAnimeGroups={animeListData.selectedAnimeGroups}/> 
              : <div>{t('AnimeListProviderNoneDescription')}</div>}
          </Stack>
      }
    </>
  )
}

export default React.memo(AnimeListsConfiguration)
