import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthContextProvider } from './context/auth-context';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <AuthContextProvider>
        <App />
    </AuthContextProvider>
);
