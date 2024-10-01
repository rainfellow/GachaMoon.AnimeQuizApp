import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from './pages/Home.page';
import { LoginPage } from './pages/Login/Login.page';
import { PrivateRoute } from './components/common/private-route';
import { DiscordAuth } from './components/discordAuth';

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
  return <RouterProvider router={router} />;
}
