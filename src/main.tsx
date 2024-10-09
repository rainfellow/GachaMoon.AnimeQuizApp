import './i18n';
import '@mantine/carousel/styles.css';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthContextProvider } from './context/auth-context';
import { LocalSettingsContextProvider } from './context/local-settings-context';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <LocalSettingsContextProvider>
        <I18nextProvider i18n={i18n}>
            <AuthContextProvider>
                <App />
            </AuthContextProvider>
        </I18nextProvider>
    </LocalSettingsContextProvider>
);
