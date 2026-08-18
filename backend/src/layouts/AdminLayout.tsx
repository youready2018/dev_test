// =============================================
// TP全屋家居 · 后台 - 管理布局组件（AdminLayout）
// 功能：后台管理系统的共用布局框架
// 包含：左侧 240px 侧边导航栏 + 顶部标题栏 + 内容区域
// 设计规范参考：UI-UX设计规范文档 第4章 - 后台组件规范
// =============================================

import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';

// =============================================
// 侧边导航栏 - Sidebar
// 功能：左侧深色导航面板，分组展示所有管理模块
// 说明：宽度 240px，深色背景 #1A1410
//       菜单项激活时左侧 3px 金色边框 + 金色文字 + 浅金色背景
// =============================================
function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // 菜单项配置：分组名称 + 菜单列表
  const menuGroups = [
    {
      label: '概览',
      items: [
        { key: 'dashboard', label: '仪表盘', icon: 'grid' },
      ],
    },
    {
      label: '内容管理',
      items: [
        { key: 'products', label: '产品管理', icon: 'cube' },
        { key: 'categories', label: '分类管理', icon: 'tag' },
        { key: 'cases', label: '案例管理', icon: 'bookmark' },
        { key: 'news', label: '新闻管理', icon: 'news' },
      ],
    },
    {
      label: '客户管理',
      items: [
        { key: 'appointments', label: '预约管理', icon: 'calendar' },
        { key: 'messages', label: '留言管理', icon: 'message' },
      ],
    },
    {
      label: '人力与系统',
      items: [
        { key: 'jobs', label: '招聘管理', icon: 'briefcase' },
        { key: 'users', label: '用户管理', icon: 'users' },
        { key: 'settings', label: '网站设置', icon: 'settings' },
      ],
    },
  ];

  // =============================================
  // SVG 图标映射（符合设计规范 3.6 节 - 后台图标索引）
  // 说明：全部使用 SVG 内联图标，18×18 viewBox，stroke-width 1.8
  // =============================================
  const iconMap: Record<string, React.ReactNode> = {
    grid: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18, flexShrink: 0 }}>
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
    cube: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18, flexShrink: 0 }}>
        <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    tag: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18, flexShrink: 0 }}>
        <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
    bookmark: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18, flexShrink: 0 }}>
        <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
      </svg>
    ),
    news: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18, flexShrink: 0 }}>
        <path d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
    calendar: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18, flexShrink: 0 }}>
        <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    message: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18, flexShrink: 0 }}>
        <path d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
    briefcase: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18, flexShrink: 0 }}>
        <path d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    users: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18, flexShrink: 0 }}>
        <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
      </svg>
    ),
    settings: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18, flexShrink: 0 }}>
        <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  };

  return (
    <div
      style={{
        width: 240,
        background: '#1A1410',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
      }}
    >
      {/* Logo 区域 */}
      <div
        style={{
          padding: '20px 24px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          fontSize: 16,
          fontWeight: 600,
          color: '#B88846',
          letterSpacing: '0.04em',
        }}
      >
        TP 管理后台
      </div>

      {/* 菜单列表 */}
      <div style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
        {menuGroups.map((group) => (
          <div key={group.label}>
            {/* 分组标签 */}
            <div
              style={{
                padding: '16px 24px 6px',
                fontSize: 11,
                color: 'rgba(255,255,255,0.3)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              {group.label}
            </div>
            {/* 菜单项 */}
            {group.items.map((item) => {
              const isActive = location.pathname === `/admin/${item.key}` || 
                (item.key === 'dashboard' && location.pathname === '/admin');
              return (
                <div
                  key={item.key}
                  onClick={() => navigate(`/admin/${item.key}`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 24px',
                    color: isActive ? '#B88846' : 'rgba(255,255,255,0.65)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    borderLeft: '3px solid',
                    borderLeftColor: isActive ? '#B88846' : 'transparent',
                    background: isActive ? 'rgba(184,136,70,0.08)' : 'transparent',
                  }}
                >
                  {iconMap[item.icon]}
                  <span style={{ fontSize: 14 }}>{item.label}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* 用户信息区域 */}
      <div
        style={{
          padding: '16px 24px',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: '#B88846',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: 14,
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          管
        </div>
        <div>
          <div style={{ fontSize: 13, color: '#fff' }}>管理员</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>超级管理员</div>
        </div>
      </div>
    </div>
  );
}

// =============================================
// 后台主布局组件
// 功能：左右分栏布局（侧边栏 + 主内容区）
//       主内容区包含顶部标题栏和页面内容
// =============================================
export default function AdminLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Inter', -apple-system, sans-serif" }}>
      {/* 左侧边栏 */}
      <Sidebar />

      {/* 右侧主内容区 */}
      <div style={{ flex: 1, minWidth: 0, background: '#F5F3F0' }}>
        {/* 顶部标题栏 */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 32px',
            background: '#fff',
            borderBottom: '1px solid #E8E3DE',
          }}
        >
          <h1 style={{ fontSize: 18, fontWeight: 500, color: '#2D2A24', margin: 0 }}>
            后台管理系统
          </h1>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            {/* 全局搜索框 */}
            <input
              type="text"
              placeholder="搜索..."
              style={{
                padding: '6px 12px',
                border: '1px solid #E8E3DE',
                borderRadius: 6,
                fontSize: 13,
                width: 200,
                outline: 'none',
              }}
            />
            {/* 通知铃铛 */}
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                border: '1px solid #E8E3DE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              {/* 红点提示 */}
              <div
                style={{
                  position: 'absolute',
                  top: 6,
                  right: 6,
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: '#FF4D4F',
                }}
              />
            </div>
          </div>
        </div>

        {/* 内容区域 */}
        <div style={{ padding: '24px 32px' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}