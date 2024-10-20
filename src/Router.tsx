import { createBrowserRouter, createRoutesFromElements, Navigate, Route, RouterProvider } from 'react-router-dom';
import { HomePage } from './pages/Home.page';
import { LoginPage } from './pages/Login/Login.page';
import { PrivateRoute } from './components/common/private-route';
import { DiscordAuth } from './components/discordAuth';
import { AccountSettingsView } from './views/AccountSettings/AccountSettingsView';
import SoloLobby from './components/SoloLobby/SoloLobby';
import { AnimeBaseView } from './views/AnimeBase/AnimeBaseView';
import MultiplayerLobby from './components/MultiplayerLobby/MultiplayerLobby';
import { AboutPageView } from './views/AboutPageView/AboutPageView';
import { ContactPage } from './pages/Contact/Contact.page';

const router = createBrowserRouter(createRoutesFromElements(
  <>
  <Route path="/" element={<PrivateRoute component={<HomePage/>}/>}>
    <Route path="sololobby" element={<SoloLobby />} />
    <Route path="mplobby" element={<MultiplayerLobby/>} />
    <Route path="customization" element={<div>Not implemented</div>} />
    <Route path="animebase" element={<AnimeBaseView/>} />
    <Route path="account" element={<AccountSettingsView />} />
    <Route path="about" element={<AboutPageView />} />
   </Route>
  <Route path="/auth/sign-in" element={<LoginPage />} />
  <Route path="/auth/discord" element={<DiscordAuth />} />
  <Route path="/contact" element={<ContactPage />} />
  </>
))

export function Router() {
  return <RouterProvider router={router} />;
}
