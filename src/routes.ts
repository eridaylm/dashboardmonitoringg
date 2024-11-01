import { lazy } from 'solid-js';
import type { RouteDefinition } from '@solidjs/router';

import Home from './pages/home';
import AboutData from './pages/about.data';
import Dashboard from './pages/dashboard';
import GoogleMaps from './pages/googlemaps';
import Login from './pages/login';
import Register from './pages/register';
import ForgotPassword from './pages/forgotpassword';
import VerifyOtp from './pages/verify';

export const routes: RouteDefinition[] = [
  {
    path: '/',
    component: Dashboard,
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/register',
    component: Register,
  },
  // {
  //   path: '/dashboard',
  //   component: Dashboard,
  // },
  {
    path: '/forgotpassword',
    component: ForgotPassword,
  },
  {
    path: '/verify',
    component: VerifyOtp,
  },
  {
    path: '/maps',
    component: GoogleMaps,
  },
  {
    path: '/about',
    component: lazy(() => import('./pages/about')),
    data: AboutData,
  },
  {
    path: '**',
    component: lazy(() => import('./errors/404')),
  },
];
