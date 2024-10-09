import React, { useContext, useState } from 'react'
import { Button, Group, LoadingOverlay, Stack, Text, TextInput } from '@mantine/core';
import { useAxios } from '@/hooks/use-axios';
import { AuthContext } from '@/context/auth-context';
import { useTranslation } from 'react-i18next';

const ProfileSettings = () => {
  const { accountInfo, setAccountInfo } = useContext(AuthContext);
  const [accountNameValue, setAccountNameValue] = useState(accountInfo?.accountName);
  const [isAccountSettingsUpdating, setIsAccountSettingsUpdating] = useState(false);
  const [accountSettingsUpdateResult, setAccountSettingsUpdateResult] = useState<boolean | null>(null);
  const axios = useAxios();
  const { t } = useTranslation('settings')

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
          {accountSettingsUpdateResult == true ? <Text color='green'>{t('ProfileUpdateSuccess')}</Text> 
          : accountSettingsUpdateResult == false ? <Text color='red'>{t('ProfileUpdateError')}</Text>
          : <></>}
      </Group>
    )
  }

  return (
    <Stack justify='center'>
      <LoadingOverlay visible={isAccountSettingsUpdating} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
      <Group justify="flex-start" mt="md">
        <TextInput label={t('AccountNameLabel')} value={accountNameValue} onChange={(event) => {setAccountNameValue(event.currentTarget.value); setAccountSettingsUpdateResult(null); }} />
        {accountSettingsUpdateResultElement(accountSettingsUpdateResult)}
      </Group>
      <Group justify="flex-end" mt="md">
        <Button onClick={handleUpdateProfileSettings}>{t('UpdateProfileButton')}</Button>
      </Group>
    </Stack>
  )
}

export default React.memo(ProfileSettings)
