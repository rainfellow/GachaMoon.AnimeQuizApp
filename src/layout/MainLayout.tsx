import { useState, useEffect, useContext } from 'react'
import { useAxios } from '../hooks/use-axios';
import { AuthContext } from '../context/auth-context';
import { AppShell } from '@mantine/core';
import { MainAppHeader } from '@/components/MainApp/MainAppHeader';
import MainAppContent from '@/components/MainApp/MainAppContent';
import classes from "./MainLayout.module.css"
import { MainAppFooter } from '@/components/MainApp/MainAppFooter';
import { MainAppAside } from '@/components/MainApp/MainAppAside';
import { ChatsContext } from '@/context/chats-context';
import { GameConfigurationContextProvider } from '@/context/game-configuration-context';
import { useMultiplayerGame } from '@/hooks/use-multiplayer-game';

const MainLayout = () => {
  const axios = useAxios();
  const [loading, setLoading] = useState(false);
  const [opened, setOpened] = useState(false);
  const { connect } = useMultiplayerGame();
  const { addCachedPlayers } = useContext(ChatsContext);
  const { accountInfo: userInfo, setAccountInfo: setAccountInfo, setFriends } = useContext(AuthContext);  
  const loadInfo = () => {
    axios.get("/Account/me").then((res) => {
        setAccountInfo(res.data);
    }).then(() => {
      axios.get("Account/friends/list").then((res) => {
        addCachedPlayers(res.data.friends);
        setFriends(res.data.friends);
      })
    }).finally(() => setLoading(false));
  }

  useEffect(() => {
    if (!userInfo && !loading) {
        setLoading(true);
        loadInfo();
    }
  }, []);
  
  useEffect(() => {
      connect();
}, [])

  return (
    <GameConfigurationContextProvider>
      <AppShell
        header={{ height: 60 }}
        footer={{ height: 56 }}
        padding="md"
        layout="default"
        aside={{ width: opened ? 300 : 40, breakpoint: "xs" }}
      >
        <AppShell.Header>
          <MainAppHeader/>
        </AppShell.Header>

        <AppShell.Main className={classes.mainLayout}>
            <MainAppContent/>
        </AppShell.Main>
        <MainAppAside opened={opened} setOpened={setOpened}/>
        <AppShell.Footer>
            <MainAppFooter/>
        </AppShell.Footer>
      </AppShell>
      </GameConfigurationContextProvider>
  );
}

export default MainLayout
