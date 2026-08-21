// src/router/index.jsx

import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute.jsx';

import { LandingPage } from '../pages/landing/LandingPage.jsx';
import { LoginPage } from '../pages/auth/LoginPage.jsx';
import { DashboardPage } from '../pages/app/DashboardPage.jsx';
import { CheckoutPage } from '../pages/checkout/CheckoutPage.jsx';

export const router = createBrowserRouter([
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/checkout',
    element: (
      <ProtectedRoute>
        <CheckoutPage />
      </ProtectedRoute>
    ),
  },
]);