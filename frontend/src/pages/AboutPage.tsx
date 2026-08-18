import { useState, useEffect } from 'react';
import { getSettings } from '../api';

export default function AboutPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  useEffect(() => { getSettings().then(setSettings); }, []);

  return (
    <div>
      <div className="hero-banner"><div className="hero-bg" /><div className="hero-overlay" />
        <div className="hero-content"><h1>关于 TP</h1><p>匠心制造 · 原创设计 · 全屋定制</p></div></div>
      <div className="page-section">
        <div className="container" style={{ maxWidth: 800 }}>
          <div style={{ lineHeight: 2, fontSize: 15, color: 'var(--text-secondary)' }}
            dangerouslySetInnerHTML={{ __html: settings.company_intro || '<p>TP全屋家居，集设计、研发、生产、销售于一体的综合性全屋定制家具企业。</p>' }} />

          <h2 className="section-title" style={{ marginTop: 60 }}>核心优势</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {[
              { title: '原创设计', desc: '50余人专业设计团队，与中央美院长期合作，累计设计专利200余项' },
              { title: '品质制造', desc: '5万平方米现代化生产基地，德国进口生产线，精度达毫米级' },
              { title: '全屋定制', desc: '客厅·卧室·书房·餐厅·茶室全空间覆盖，一站式解决方案' },
              { title: '贴心服务', desc: '5年质保，终身维护，全国300+服务网点，专属客服一对一' },
            ].map((f, i) => (
              <div key={i} style={{ background: 'var(--cream)', borderRadius: 'var(--radius)', padding: 28 }}>
                <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: 'var(--primary)' }}>{f.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-secondary)' }}>{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="stats" style={{ marginTop: 60 }}>
            {[
              { num: '200+', label: '设计专利' }, { num: '50,000㎡', label: '生产基地' },
              { num: '50,000+', label: '服务家庭' }, { num: '20年', label: '行业经验' },
            ].map((s, i) => (
              <div key={i} className="stat-item"><h3>{s.num}</h3><p>{s.label}</p></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}