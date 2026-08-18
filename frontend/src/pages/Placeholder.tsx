// =============================================
// TP全屋家居 · 前台 - 占位页面组件
// 功能：在页面未开发完成时显示占位信息
// 说明：后续每个页面将替换为真实内容
// =============================================

export function PlaceholderPage({ title }: { title: string }) {
  // 解析页面编号用于 Hero 背景
  const pageInfo = title.split(' - ');

  return (
    <>
      {/* Hero 区域：子页面顶部全宽 Banner */}
      {/* 设计规范参考：UI-UX设计规范 3.2.2 节 - 子页面 Hero Banner */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: 240,
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #3D2B1F 0%, #5C3D2E 100%)',
        }}
      >
        {/* 半透明渐变遮罩 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, rgba(44,24,16,0.80) 0%, rgba(61,43,31,0.60) 100%)',
          }}
        />
        {/* Hero 标题内容 */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 700, padding: '0 24px' }}>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 34,
              color: '#fff',
              marginBottom: 12,
              fontWeight: 600,
              letterSpacing: '0.04em',
            }}
          >
            {pageInfo[0]}
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.80)', lineHeight: 1.7 }}>
            页面开发中 · 敬请期待
          </p>
        </div>
      </div>

      {/* 页面内容区域：居中占位提示 */}
      <div
        style={{
          padding: '120px 40px',
          textAlign: 'center',
          maxWidth: 1200,
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'var(--primary-bg)',
            marginBottom: 24,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--primary)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ width: 36, height: 36 }}
          >
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
        </div>
        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 22,
            color: 'var(--dark)',
            marginBottom: 8,
          }}
        >
          页面开发中
        </h2>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 32 }}>
          该页面将在后续阶段完成开发
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <a href="/" className="btn-primary">
            返回首页
          </a>
        </div>
      </div>
    </>
  );
}