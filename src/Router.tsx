import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from 'react-router-dom';
import { HomePage } from './pages/Home.page';
import { LoginPage } from './pages/Login/Login.page';
import { PrivateRoute } from './components/common/private-route';
import { DiscordAuth } from './components/discordAuth';
import { SoloGameContextProvider } from './context/solo-game-context';
import { SoloLobbyView } from './views/SoloLobby/SoloLobbyView';
import { AnimeContextProvider } from './context/anime-context';
import { AccountSettingsView } from './views/AccountSettings/AccountSettingsView';
import SoloLobby from './components/SoloLobby/SoloLobby';

const router2 = createBrowserRouter(createRoutesFromElements(
  <>
  <Route path="/" element={<PrivateRoute component={<HomePage/>}/>}>
    <Route path="sololobby" element={<SoloLobby />} />
    <Route path="mplobby" element={<div>Not implemented</div>} />
    <Route path="customization" element={<div>Not implemented</div>} />
    <Route path="account" element={<AccountSettingsView />} />
   </Route>
  <Route path="/auth/sign-in" element={<LoginPage />} />
  <Route path="/auth/discord" element={<DiscordAuth />} />
  </>
))

const router = createBrowserRouter([
  {
    path: '*',
    element: <PrivateRoute component={<HomePage/>}/>,
  },
  {
    path: '/auth/sign-in',
    element: <LoginPage />,
  },
  {
    path: '/auth/discord',
    element: <DiscordAuth />,
  },
]);

export function Router() {
  return <RouterProvider router={router2} />;
}
