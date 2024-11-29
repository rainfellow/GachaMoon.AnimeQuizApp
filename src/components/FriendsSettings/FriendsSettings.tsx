import React, { useContext, useEffect, useState } from 'react'
import { Button, Group, LoadingOverlay, ScrollArea, Stack, Table, Tabs, Text, TextInput } from '@mantine/core';
import { useAxios } from '@/hooks/use-axios';
import { AuthContext } from '@/context/auth-context';
import { useTranslation } from 'react-i18next';
import { FriendRequest, FriendRequestType } from '@/models/User';
import classes from './FriendsSettings.module.css'

const FriendsSettings = () => {
  const { account } = useContext(AuthContext);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [incomingTableElements, setIncomingTableElements] = useState<JSX.Element[]>([]);
  const [outgoingTableElements, setOutgoingTableElements] = useState<JSX.Element[]>([]);
  const [isResolvingFriendRequest, setIsResolvingFriendRequest] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const axios = useAxios();
  const { t } = useTranslation('settings')

  const loadInfo = () => {
    return axios.get("/Account/friends/requests").then((res) => {
      setFriendRequests(res.data.friendRequests);
      setIncomingTableElements(
        res.data.friendRequests
          .filter((request: FriendRequest) => {
            return request.requestType == FriendRequestType.Incoming
          })
          .map((friendRequest: FriendRequest) => 
          <Table.Tr key={friendRequest.id}>
            <Table.Td>{friendRequest.friendData.accountName}#{friendRequest.friendData.accountId}</Table.Td>
            <Table.Td>
              <Group>
                <Button onClick={() => resolveFriendRequest(friendRequest, true)} color='green'>
                  <Text>Accept</Text>
                </Button>
                <Button onClick={() => resolveFriendRequest(friendRequest, false)} color='red'>
                  <Text>Deny</Text>
                </Button>
              </Group>
            </Table.Td>
        </Table.Tr>
        ));
      setOutgoingTableElements(
        res.data.friendRequests
          .filter((request: FriendRequest) => {
            return request.requestType == FriendRequestType.Outgoing
          })
          .map((friendRequest: FriendRequest) => 
          <Table.Tr key={friendRequest.id}>
            <Table.Td>{friendRequest.friendData.accountName}#{friendRequest.friendData.accountId}</Table.Td>
          </Table.Tr>
        ));
    });
  }

  const resolveFriendRequest = (request: FriendRequest, accepted: boolean) => {
    setIsResolvingFriendRequest(true)
    axios
        .post(`Account/friends/resolve?friendRequestId=${request.id}&accepted=${accepted}`)
        .then(() => {
          setIsResolvingFriendRequest(false);
          loadInfo();
        })
  }

  useEffect(() => {
    if (account != null)
    loadInfo().then(() => setIsLoaded(true));
  }, [account]);

  return (
    <>
      <LoadingOverlay visible={isResolvingFriendRequest || !isLoaded} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
      <Tabs color="teal" defaultValue="first">
        <Tabs.List>
          <Tabs.Tab value="first">{t('IncomingFriendRequestsTabTitle')}</Tabs.Tab>
          <Tabs.Tab value="second" color="blue">{t('OutgoingFriendRequestsTabTitle')}</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="first" pt="xs">
        { incomingTableElements.length == 0
        ? <Text c='dimmed'>{t('NoIncomingFriendRequestsPlaceholder')}</Text>
        : <ScrollArea h={300} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
            <Table miw={700}>
              <Table.Thead classNames={(classes.header, { [classes.scrolled]: scrolled })}>
                <Table.Tr>
                  <Table.Th>{t('FriendRequestsTableNameColumn')}</Table.Th>
                  <Table.Th></Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{incomingTableElements}</Table.Tbody>
            </Table>
          </ScrollArea>
        }
        </Tabs.Panel>

        <Tabs.Panel value="second" pt="xs">
        { outgoingTableElements.length == 0
        ? <Text c='dimmed'>{t('NoOutgoingFriendRequestsPlaceholder')}</Text>
        : <ScrollArea h={300} onScrollPositionChange={({ y }) => setScrolled(y !== 0)}>
            <Table miw={700}>
              <Table.Thead classNames={(classes.header, { [classes.scrolled]: scrolled })}>
                <Table.Tr>
                  <Table.Th>{t('FriendRequestsTableNameColumn')}</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>{outgoingTableElements}</Table.Tbody>
            </Table>
          </ScrollArea>
        }
        </Tabs.Panel>
      </Tabs>
    </>
  )
}

export default React.memo(FriendsSettings)
