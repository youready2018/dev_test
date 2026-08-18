// =============================================
// TP全屋家居 · 前台 - 应用入口文件
// 功能：初始化 React 应用，挂载路由系统
// 说明：使用 React Router 的 RouterProvider 驱动页面切换
// =============================================

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import './index.css';
import router from './router';

// 将路由系统挂载到 #root DOM 节点上
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);