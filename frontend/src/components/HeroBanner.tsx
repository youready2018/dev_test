// =============================================
// TP全屋家居 · 前台 - HeroBanner 全局组件
// 功能：子页面顶部全宽 Banner，深色渐变背景 + 标题 + 副标题
// =============================================

interface HeroBannerProps {
  title: string;
  subtitle: string;
  height?: number;
}

export default function HeroBanner({ title, subtitle, height = 300 }: HeroBannerProps) {
  return (
    <div className="page-hero" style={{ height }}>
      <div className="hero-bg" style={{ background: 'linear-gradient(135deg, #3D2B1F, #5C3D2E)' }} />
      <div className="hero-overlay" />
      <div className="hero-content">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </div>
  );
}