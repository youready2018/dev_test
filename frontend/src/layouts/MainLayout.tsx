// =============================================
// TP全屋家居 · 前台 - 主布局组件（MainLayout）
// 功能：所有前台页面的共用布局框架
// 包含：顶部粘性导航栏 + 页面内容区域（Outlet）+ 底部页脚
// 设计规范参考：UI-UX设计规范文档 3.1节（导航系统）& 3.7节（底部页脚）
// =============================================

import { Outlet } from 'react-router-dom';

// =============================================
// 导航栏组件 - Navbar
// 功能：全站顶部粘性导航，包含 Logo、一级菜单、二级下拉菜单
// 说明：position: sticky，白底，底部 1px 边框
//       导航项 hover 变色 + 底部边框过渡
//       下拉菜单 hover 展开（opacity + translateY 过渡）
// =============================================
function Navbar() {
  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'var(--white)',
        borderBottom: '1px solid var(--border)',
        padding: '0 40px',
        display: 'flex',
        alignItems: 'center',
        height: 60,
      }}
    >
      {/* 左侧品牌 Logo：衬线字体，主色，点击回到首页 */}
      <a
        href="/"
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 20,
          fontWeight: 700,
          color: 'var(--primary)',
          whiteSpace: 'nowrap',
          marginRight: 48,
          cursor: 'pointer',
          letterSpacing: '0.04em',
        }}
      >
        TP 全屋家居
      </a>

      {/* 右侧导航链接列表 */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 0 }}>
        {/* 首页（无二级菜单） */}
        <NavItem label="首页" href="/" />

        {/* 产品（有二级菜单：产品中心、新案例展示） */}
        <NavItem label="产品" hasDropdown>
          <DropdownItem label="产品中心" href="/products" />
          <DropdownItem label="新案例展示" href="/cases" />
        </NavItem>

        {/* 新闻（有二级菜单：企业新闻、行业资讯） */}
        <NavItem label="新闻" hasDropdown>
          <DropdownItem label="企业新闻" href="/news/enterprise" />
          <DropdownItem label="行业资讯" href="/news/industry" />
        </NavItem>

        {/* 招聘入口（有二级菜单：社会招聘、校园招聘） */}
        <NavItem label="招聘入口" hasDropdown>
          <DropdownItem label="社会招聘" href="/jobs/social" />
          <DropdownItem label="校园招聘" href="/jobs/campus" />
        </NavItem>

        {/* 关于我们（有二级菜单） */}
        <NavItem label="关于我们" hasDropdown>
          <DropdownItem label="关于TP" href="/about" />
          <DropdownItem label="发展历程" href="/history" />
          <DropdownItem label="品牌介绍" href="/brand-story" />
          <DropdownItem label="在线预约" href="/booking" />
          <DropdownItem label="联系我们" href="/contact" />
        </NavItem>
      </div>
    </nav>
  );
}

// =============================================
// 导航单项组件
// 功能：渲染单个导航项，支持二级下拉菜单
// props：
//   - label: 显示文字
//   - href: 点击跳转地址（无下拉时使用）
//   - hasDropdown: 是否有二级下拉菜单
//   - children: 下拉菜单内容（DropdownItem 列表）
// =============================================
function NavItem({
  label,
  href,
  hasDropdown,
  children,
}: {
  label: string;
  href?: string;
  hasDropdown?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div
      className="nav-item"
      style={{
        position: 'relative',
        display: 'inline-block',
      }}
    >
      {/* 导航链接：内边距 18px 22px，hover 变色 + 底部边框（使用 CSS 类控制） */}
      <a
        href={href || '#'}
        className="nav-link"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          padding: '18px 22px',
          fontSize: 14,
          fontWeight: 500,
          cursor: 'pointer',
        }}
      >
        {label}
        {/* 下拉箭头 ▼，hover 时旋转 180° */}
        {hasDropdown && (
          <span className="arrow" style={{ fontSize: 10 }}>
            ▼
          </span>
        )}
      </a>

      {/* 二级下拉菜单容器：绝对定位，默认隐藏（CSS 类控制 hover 展开） */}
      {hasDropdown && (
        <div
          className="dropdown-menu"
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            minWidth: 170,
            background: 'var(--white)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-lg)',
            padding: '6px 0',
            zIndex: 200,
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

// =============================================
// 下拉菜单项组件
// =============================================
function DropdownItem({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      className="dropdown-item"
      style={{
        display: 'block',
        padding: '10px 22px',
        fontSize: 14,
        cursor: 'pointer',
      }}
    >
      {label}
    </a>
  );
}

// =============================================
// 底部页脚组件 - Footer
// 功能：全站共用底部，包含品牌简介、快速导航、联系方式、社交媒体
// 设计规范参考：UI-UX设计规范文档 3.7节（底部页脚）
// 布局：四列网格（2fr 1.2fr 1.2fr 1.2fr），深色背景
// =============================================
function Footer() {
  const footerStyle: React.CSSProperties = {
    background: 'var(--dark)',
    padding: '60px 40px 32px',
    marginTop: 80,
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '2fr 1.2fr 1.2fr 1.2fr',
    gap: 40,
    maxWidth: 1200,
    margin: '0 auto',
  };

  const columnTitleStyle: React.CSSProperties = {
    fontSize: 15,
    color: '#fff',
    fontWeight: 600,
    fontFamily: 'var(--font-sans)',
    marginBottom: 16,
  };

  const linkStyle: React.CSSProperties = {
    display: 'block',
    color: 'rgba(255,255,255,0.55)',
    fontSize: 14,
    lineHeight: 2,
    cursor: 'pointer',
    transition: 'color 0.2s ease',
    textDecoration: 'none',
  };

  return (
    <footer style={footerStyle}>
      <div style={gridStyle}>
        {/* 第一列：品牌简介 + 在线预约按钮 */}
        <div>
          <div style={columnTitleStyle}>TP 全屋家居</div>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, lineHeight: 1.8, marginBottom: 20 }}>
            TP全屋家居集设计、研发、生产、销售于一体，致力于为每个家庭提供高品质的全屋定制家具解决方案。
          </p>
          <a
            href="/booking"
            className="btn-primary"
            style={{ display: 'inline-block', textDecoration: 'none' }}
          >
            在线预约
          </a>
        </div>

        {/* 第二列：快速导航（仅一级菜单，带 +/- 图标交互） */}
        <div>
          <div style={columnTitleStyle}>快速导航</div>
          <QuickLink label="首页" href="/" />
          <QuickLink label="产品" href="/products" />
          <QuickLink label="新闻" href="/news/enterprise" />
          <QuickLink label="招聘入口" href="/jobs/social" />
          <QuickLink label="关于我们" href="/about" />
        </div>

        {/* 第三列：联系方式 */}
        <div>
          <div style={columnTitleStyle}>联系方式</div>
          <div style={linkStyle}>地址：广东省深圳市南山区</div>
          <div style={linkStyle}>销售热线：400-xxx-xxxx</div>
          <div style={linkStyle}>服务热线：400-xxx-xxxx</div>
          <div style={linkStyle}>邮箱：contact@tp-home.com</div>
        </div>

        {/* 第四列：关注我们（社交媒体入口占位） */}
        <div>
          <div style={columnTitleStyle}>关注我们</div>
          <div style={linkStyle}>微信公众号</div>
          <div style={linkStyle}>视频号</div>
          <div style={linkStyle}>抖音</div>
          <div style={linkStyle}>小红书</div>
        </div>
      </div>

      {/* 版权信息 */}
      <div
        style={{
          textAlign: 'center',
          paddingTop: 32,
          marginTop: 32,
          borderTop: '1px solid rgba(255,255,255,0.08)',
          color: 'rgba(255,255,255,0.35)',
          fontSize: 13,
        }}
      >
        © 2026 TP全屋家居 All Rights Reserved. &nbsp;|&nbsp; 备案号：粤ICP备xxxxxxxx号
      </div>
    </footer>
  );
}

// =============================================
// 快速导航链接组件（带 +/- 图标交互）
// 设计规范：默认"+"图标，悬停变为"−"图标
// =============================================
function QuickLink({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      className="quick-link"
      style={{
        display: 'block',
        color: 'rgba(255,255,255,0.55)',
        fontSize: 14,
        lineHeight: 2,
        cursor: 'pointer',
        textDecoration: 'none',
      }}
    >
      {label}
    </a>
  );
}

// =============================================
// 前台主布局组件
// 功能：渲染完整页面框架（导航栏 + 内容区 + 底部页脚）
// 说明：所有前台页面共用此布局
//       <Outlet /> 是 React Router 的子页面渲染出口
// =============================================
export default function MainLayout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 顶部导航栏：粘性定位，滚动时固定在顶部 */}
      <Navbar />

      {/* 页面内容区域：由 React Router 根据当前路由动态渲染 */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      {/* 底部页脚：全站共用 */}
      <Footer />
    </div>
  );
}