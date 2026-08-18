// =============================================
// TP全屋家居 · 前台 - 品牌介绍页（P14）
// 功能：品牌故事、设计哲学、品牌承诺
// =============================================

export default function BrandStoryPage() {
  return (
    <div>
      <div className="page-hero">
        <div className="hero-bg" style={{ background: 'linear-gradient(135deg, #3D2B1F, #5C3D2E)' }} />
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1>品牌介绍</h1>
          <p>匠心品质 · 原创设计 — TP全屋家居的品牌故事</p>
        </div>
      </div>
      <div className="page-section">
        <div className="container">
          {/* 品牌故事 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: 26, marginBottom: 16 }}>品牌故事</h2>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8 }}>TP全屋家居始于2005年，创始人以"让每个家庭都拥有高品质的家居空间"为初心，从一家小型实木家具作坊起步，逐步发展成为集设计、研发、生产、销售于一体的全屋定制家居企业。</p>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8, marginTop: 12 }}>我们坚信，好的家具不仅是一件器物，更是一种生活方式的表达。每一件TP产品，都承载着对木材的尊重、对工艺的执着和对生活的热爱。</p>
            </div>
            <div style={{ aspectRatio: '4/3', background: 'var(--cream)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-light)', fontSize: 14 }}>[ 品牌故事图 ]</div>
          </div>

          {/* 设计哲学 */}
          <div style={{ marginTop: 40 }}>
            <h2 style={{ fontSize: 22, marginBottom: 16 }}>设计哲学</h2>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8 }}>以"简而美、实而精"为设计理念，融合东方美学与现代设计语言，追求形式与功能的完美统一。注重木材的自然纹理与触感，强调结构的合理性与工艺的精湛性，让每一件产品既有颜值，又经得起时间考验。</p>
          </div>

          {/* 品牌承诺 */}
          <div style={{ marginTop: 32 }}>
            <h2 style={{ fontSize: 22, marginBottom: 16 }}>品牌承诺</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
              {[
                { icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', title: '品质承诺', desc: '精选优质木材，严控生产工艺，确保每件产品达到最高品质标准' },
                { icon: 'M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z', title: '服务承诺', desc: '专业设计师一对一服务，从沟通到交付全程无忧，5年质保终身维护' },
                { icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z', title: '环保承诺', desc: '选用环保材料，严格遵循环保标准，为每个家庭打造健康安全的居住环境' },
              ].map((p, i) => (
                <div key={i} style={{ background: 'var(--white)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius)', padding: 24, textAlign: 'center' }}>
                  <div style={{ width: 48, height: 48, margin: '0 auto 12px', borderRadius: '50%', background: 'var(--primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}><path d={p.icon} /></svg>
                  </div>
                  <h4 style={{ fontFamily: 'var(--font-sans)', fontSize: 15, marginBottom: 4 }}>{p.title}</h4>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}