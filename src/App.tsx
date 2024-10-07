import '@mantine/core/styles.css';

import { Loader, MantineProvider } from '@mantine/core';
import { Router } from './Router';
import { theme } from './theme';
import { Suspense, useEffect, useState } from 'react';
import { useLocalStorage } from './hooks/use-local-storage';
import { useAuth } from './hooks/use-auth';
import { LocalSettingsContextProvider } from './context/local-settings-context';

export default function App() {

    const [initialized, setInitialized] = useState(false);
    const defaultColorTheme = "dark"
    const { getItem } = useLocalStorage();
    const { login, isAuthenticated } = useAuth();

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
        <MantineProvider defaultColorScheme={defaultColorTheme} theme={theme}>
            <Suspense
                fallback={
                  <div className="pt-3 text-center">
                    <Loader color="primary" variant="grow" />
                  </div>
                }
            >
            {
                initialized && 
                <LocalSettingsContextProvider>
                    <Router />
                </LocalSettingsContextProvider>
            }
          </Suspense>
        </MantineProvider>
    );
}
