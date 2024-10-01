import { useState, useEffect, useContext } from 'react'
import { useAxios } from '../hooks/use-axios';
import { AuthContext } from '../context/auth-context';
import { AppShell, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { MainAppHeader } from '@/components/MainApp/MainAppHeader';
import MainAppContent from '@/components/MainApp/MainAppContent';

const MainLayout = () => {
  const axios = useAxios();
  const [loading, setLoading] = useState(false);
  const { accountInfo: userInfo, setAccountInfo: setAccountInfo } = useContext(AuthContext);  

  const loadInfo = () => {
    axios.get("/Account/me").then((res) => {
        setAccountInfo(res.data);
    }).finally(() => setLoading(false));
  }

  useEffect(() => {
    if (!userInfo && !loading) {
        setLoading(true);
        loadInfo();
    }
  }, []);

  return (
    <AppShell
      header={{ height: 60 }}
      padding="md"
    >
      <AppShell.Header>
        <MainAppHeader/>
      </AppShell.Header>

      <AppShell.Main><MainAppContent/></AppShell.Main>
    </AppShell>
  );
}

export default MainLayout
