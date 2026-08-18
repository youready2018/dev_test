// =============================================
// TP全屋家居 · 后台 - 路由配置文件
// =============================================

import { createBrowserRouter, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProductManagePage from './pages/ProductManagePage';
import CategoryManagePage from './pages/CategoryManagePage';
import CaseManagePage from './pages/CaseManagePage';
import NewsManagePage from './pages/NewsManagePage';
import AppointmentManagePage from './pages/AppointmentManagePage';
import MessageManagePage from './pages/MessageManagePage';
import JobManagePage from './pages/JobManagePage';
import UserManagePage from './pages/UserManagePage';
import SiteSettingsPage from './pages/SiteSettingsPage';

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  {
    path: '/admin',
    element: <ProtectedRoute><AdminLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'products', element: <ProductManagePage /> },
      { path: 'categories', element: <CategoryManagePage /> },
      { path: 'cases', element: <CaseManagePage /> },
      { path: 'news', element: <NewsManagePage /> },
      { path: 'appointments', element: <AppointmentManagePage /> },
      { path: 'messages', element: <MessageManagePage /> },
      { path: 'jobs', element: <JobManagePage /> },
      { path: 'users', element: <UserManagePage /> },
      { path: 'settings', element: <SiteSettingsPage /> },
    ],
  },
  { path: '/', element: <Navigate to="/admin" replace /> },
  { path: '*', element: <Navigate to="/admin" replace /> },
]);

export default router;