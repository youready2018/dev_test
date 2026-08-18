// =============================================
// TP全屋家居 · 前台 - FeatureCard 全局组件
// 功能：核心优势卡片（图标 + 标题 + 描述）
// =============================================
interface FeatureCardProps {
  icon: string;
  title: string;
  desc: string;
}

export default function FeatureCard({ icon, title, desc }: FeatureCardProps) {
  return (
    <div className="feature-card">
      <div className="feature-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
          <path d={icon} />
        </svg>
      </div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}