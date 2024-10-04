import React, { Dispatch, SetStateAction, Suspense, useEffect, useState } from 'react'
import { Button, Checkbox, Fieldset, Group, Loader, LoadingOverlay, SegmentedControl, Stack, Text, TextInput } from '@mantine/core';
import { useAxios } from '@/hooks/use-axios';
import { AxiosResponse } from 'axios';
import { AnimeListUpdateResponse } from '@/models/AnimeLists';

const AnimeListDetails = (props: { provider: string; animeListUser: string | null; setAnimeListUpdateResult: (arg0: AnimeListUpdateResponse) => void; animeListUpdateResult: AnimeListUpdateResponse; selectedAnimeGroups: any[] | null}) => {
    const [serviceUsername, setServiceUsername] = useState(props.animeListUser == null ? '' : props.animeListUser);
    const [completedAnimeAllowed, setCompletedAnimeAllowed] = useState(props.selectedAnimeGroups != null && props.selectedAnimeGroups.find((value) => value == "completed") != undefined);
    const [watchingAnimeAllowed, setWatchingAnimeAllowed] = useState(props.selectedAnimeGroups != null && props.selectedAnimeGroups.find((value) => value == "watching") != undefined);
    const [pausedAnimeAllowed, setPausedAnimeAllowed] = useState(props.selectedAnimeGroups != null && props.selectedAnimeGroups.find((value) => value == "paused") != undefined);
    const [droppedAnimeAllowed, setDroppedAnimeAllowed] = useState(props.selectedAnimeGroups != null && props.selectedAnimeGroups.find((value) => value == "dropped") != undefined);
    const [plannedAnimeAllowed, setPlannedAnimeAllowed] = useState(props.selectedAnimeGroups != null && props.selectedAnimeGroups.find((value) => value == "planned") != undefined);
    const [isAnimeListUpdating, setIsAnimeListUpdating] = useState(false);

    const axios = useAxios();

    const generateAllowedAnimeGroupsList = () => {
        let allowedList = [];
        if (completedAnimeAllowed)
            allowedList.push("completed")
        if (watchingAnimeAllowed)
            allowedList.push("watching")
        if (pausedAnimeAllowed)
            allowedList.push("paused")
        if (droppedAnimeAllowed)
            allowedList.push("dropped")
        if (plannedAnimeAllowed)
            allowedList.push("planned")
        return allowedList;
    }

    const handleUpdateProviderList = () => {
        let allowedListGroups = generateAllowedAnimeGroupsList()
        setIsAnimeListUpdating(true)
        if(allowedListGroups.length == 0)
        {
            console.log('tried to update list with no anime selected')
            return
        }
        axios
            .post('Account/connectservice', {serviceType: "AnimeList", serviceProvider: props.provider, externalServiceUserId: serviceUsername, allowedListGroups: allowedListGroups})
            .then((response:AxiosResponse) => {
                props.setAnimeListUpdateResult(response.data)
                setIsAnimeListUpdating(false)
            });
    }

  
  return (
    <>
    <Stack justify='flex-start'>
        <Fieldset legend="Anime List Provider Settings">
            <LoadingOverlay visible={isAnimeListUpdating} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
            <TextInput label="Account Name" value={serviceUsername} onChange={(event) => setServiceUsername(event.currentTarget.value)} />
            <Group mt="xs">
            <Checkbox value="Completed" label="Completed" checked={completedAnimeAllowed} onChange={(event) => setCompletedAnimeAllowed(event.currentTarget.checked)}/>
            <Checkbox value="Watching" label="Watching" checked={watchingAnimeAllowed} onChange={(event) => setWatchingAnimeAllowed(event.currentTarget.checked)}/>
            <Checkbox value="Paused" label="Paused" checked={pausedAnimeAllowed} onChange={(event) => setPausedAnimeAllowed(event.currentTarget.checked)}/>
            <Checkbox value="Dropped" label="Dropped" checked={droppedAnimeAllowed} onChange={(event) => setDroppedAnimeAllowed(event.currentTarget.checked)}/>
            <Checkbox value="Planned" label="Planned" checked={plannedAnimeAllowed} onChange={(event) => setPlannedAnimeAllowed(event.currentTarget.checked)}/>
            </Group>
            {(completedAnimeAllowed || watchingAnimeAllowed || pausedAnimeAllowed || droppedAnimeAllowed || plannedAnimeAllowed) == false ? 
                <Group>
                    <Text color='red'>Please select at least one anime type.</Text>
                </Group> 
              : 
                <></>}
            <Group justify="flex-end" mt="md">
            <Button onClick={handleUpdateProviderList}>Update list</Button>
            </Group>
            <Group justify="flex-start" mt="md">
                {props.animeListUpdateResult.externalServiceUserId == '' ? <></> : <Text color='green'>Anime list updated! New list has {props.animeListUpdateResult.animeCount} animes.</Text>}
            </Group>
        </Fieldset>
    </Stack>
    </>
  )
}

export default React.memo(AnimeListDetails)
