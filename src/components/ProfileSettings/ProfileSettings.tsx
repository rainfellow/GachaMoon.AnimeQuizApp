import React, { Suspense, useContext, useEffect, useState } from 'react'
import { Button, Group, Loader, LoadingOverlay, SegmentedControl, Stack, Text, TextInput } from '@mantine/core';
import { AxiosResponse } from 'axios';
import { useAxios } from '@/hooks/use-axios';
import { AuthContext } from '@/context/auth-context';
import { useAuth } from '@/hooks/use-auth';

const ProfileSettings = () => {
  const { accountInfo, setAccountInfo } = useContext(AuthContext);
  const [accountNameValue, setAccountNameValue] = useState(accountInfo?.accountName);
  const [isAccountSettingsUpdating, setIsAccountSettingsUpdating] = useState(false);
  const [accountSettingsUpdateResult, setAccountSettingsUpdateResult] = useState<boolean | null>(null);
  const axios = useAxios();

  const loadInfo = () => {
    return axios.get("/Account/me").then((res) => {
        setAccountInfo(res.data);
    });
  }

  const handleUpdateProfileSettings = () => {
    setIsAccountSettingsUpdating(true)
    axios
        .post('Account/me', {updatedAccountName: accountNameValue})
        .catch(() => {
          setAccountSettingsUpdateResult(false)
        })
        .then(() => loadInfo())
        .then(() => {
            setIsAccountSettingsUpdating(false)
            setAccountSettingsUpdateResult(true)
        });
  } 

  const accountSettingsUpdateResultElement = (accountSettingsUpdateResult: boolean | null) => {
    return (
      <Group justify="flex-start" mt="md">
          {accountSettingsUpdateResult == true ? <Text color='green'>Profile settings updated successfully.</Text> 
          : accountSettingsUpdateResult == false ? <Text color='red'>Error. Account settings were not updated.</Text>
          : <></>}
      </Group>
    )
  }

  return (
    <Stack justify='center'>
      <LoadingOverlay visible={isAccountSettingsUpdating} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
      <Group justify="flex-start" mt="md">
        <TextInput label="Account Name" value={accountNameValue} onChange={(event) => {setAccountNameValue(event.currentTarget.value); setAccountSettingsUpdateResult(null); }} />
        {accountSettingsUpdateResultElement(accountSettingsUpdateResult)}
      </Group>
      <Group justify="flex-end" mt="md">
        <Button onClick={handleUpdateProfileSettings}>Update profile</Button>
      </Group>
    </Stack>
  )
}

export default React.memo(ProfileSettings)
