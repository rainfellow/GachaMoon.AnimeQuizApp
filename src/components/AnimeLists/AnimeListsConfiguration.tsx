import React, { useEffect, useState } from 'react'
import { Loader, SegmentedControl, Stack, Text } from '@mantine/core';
import AnimeListDetails from './AnimeListDetails';
import { AxiosResponse } from 'axios';
import { useAxios } from '@/hooks/use-axios';
import { AnimeListUpdateResponse } from '@/models/AnimeLists';
import { useTranslation } from 'react-i18next';

const AnimeListsConfiguration = () => {
    const [animeListProviderValue, setAnimeListProviderValue] = useState('none');
    const axios = useAxios();
    const [animeListData, setAnimeListData] = useState({ animeListServiceProvider: 'NotLoaded', animeListUserId: "", userAnimes: [], selectedAnimeGroups: []});
    const [animeListUpdateResult, setAnimeListUpdateResult] = useState({externalServiceUserId: '', animeCount: 0});
    const { t } = useTranslation('settings');

    const animeListUpdateResultReceived = (response: AnimeListUpdateResponse) => {
      setAnimeListUpdateResult(response);
    }
  
    useEffect(() => {
      axios.get('Account/myanimelist').then((response: AxiosResponse) => {
          setAnimeListData(response.data)
          setAnimeListProviderValue(response.data.animeListServiceProvider)
          console.log("fetched anime list of user " + response.data.animeListUserId)
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
                { label: 'Anilist', value: 'Anilist', disabled: true },
                { label: 'Shikimori', value: 'Shikimori', disabled: true },
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
