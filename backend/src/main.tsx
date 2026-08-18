// =============================================
// TP全屋家居 · 后台 - 应用入口文件
// 功能：初始化 React 应用，挂载路由系统，配置 Ant Design 品牌主题
// 说明：使用 React Router 的 RouterProvider 驱动页面切换
//       使用 ConfigProvider 注入品牌色主题（Phase 2.2）
// =============================================

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import router from './router';

// =============================================
// Ant Design 主题配置（品牌色定制）
// 依据 UI-UX 设计规范附录B：
//   主色 #B88846（暖金色）
//   深色背景 #1A1410（侧边栏）
//   内容背景 #F5F3F0
// =============================================
const themeConfig = {
  token: {
    colorPrimary: '#B88846',
    colorPrimaryHover: '#8B6F3C',
    colorBgContainer: '#FFFFFF',
    colorBgLayout: '#F5F3F0',
    colorText: '#2D2A24',
    colorTextSecondary: '#6B5E4A',
    borderRadius: 6,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  components: {
    Menu: {
      colorItemBg: '#1A1410',
      colorItemText: 'rgba(255,255,255,0.65)',
      colorItemTextSelected: '#B88846',
      colorItemBgSelected: 'rgba(184,136,70,0.08)',
      colorItemBgHover: 'rgba(255,255,255,0.04)',
    },
    Table: {
      headerBg: '#F5EDE0',
      headerColor: '#2D2A24',
      borderColor: '#E8E0D6',
    },
    Button: {
      primaryColor: '#FFFFFF',
      defaultBorderColor: '#E8E0D6',
    },
    Card: {
      colorBorderSecondary: '#E8E0D6',
    },
  },
};

// 将路由系统挂载到 #root DOM 节点上
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider theme={themeConfig}>
      <RouterProvider router={router} />
    </ConfigProvider>
  </StrictMode>,
);