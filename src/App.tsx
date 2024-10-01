import '@mantine/core/styles.css';

import { Loader, MantineProvider } from '@mantine/core';
import { Router } from './Router';
import { theme } from './theme';
import { Suspense, useContext, useEffect, useState } from 'react';
import { useLocalStorage } from './hooks/use-local-storage';
import { useAuth } from './hooks/use-auth';
import { AuthContext } from './context/auth-context';

export default function App() {
  
  const [initialized, setInitialized] = useState(false);

  const { getItem } = useLocalStorage();
  const { login, isAuthenticated } = useAuth();
  const { accountInfo } = useContext(AuthContext);
  
  useEffect(() => {
    if (!initialized) {
        if (!isAuthenticated()) {
            const account = getItem("account");
            if (account) {
                login(JSON.parse(account));
            }
        }
        setInitialized(true);
    }
}, []);
  return (
    <MantineProvider theme={theme}>
       <Suspense
        fallback={
          <div className="pt-3 text-center">
            <Loader color="primary" variant="grow" />
          </div>
        }
      >
      { initialized && <Router />}
      </Suspense>
    </MantineProvider>
  );
}
