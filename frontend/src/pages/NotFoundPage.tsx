// =============================================
// TP全屋家居 · 前台 - 404 页面
// =============================================
import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '120px 40px', textAlign: 'center', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 80, height: 80, borderRadius: '50%', background: 'var(--primary-bg)', marginBottom: 24 }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 36, height: 36 }}>
          <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      </div>
      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 22, color: 'var(--dark)', marginBottom: 8 }}>页面未找到</h2>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 32 }}>您访问的页面不存在或已被移除</p>
      <button className="btn-primary" onClick={() => navigate('/')}>返回首页</button>
    </div>
  );
}