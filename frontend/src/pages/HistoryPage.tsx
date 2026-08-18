// =============================================
// TP全屋家居 · 前台 - 发展历程页（P13）
// 功能：时间线展示公司发展里程碑
// =============================================

export default function HistoryPage() {
  const milestones = [
    { year: '2005', desc: 'TP全屋家居成立于广东深圳，初始以实木家具制造为主，奠定了扎实的工艺基础' },
    { year: '2010', desc: '生产基地扩建至5万平方米，引进德国先进生产线，产能大幅提升' },
    { year: '2015', desc: '成立原创设计中心，与中央美术学院、广州美术学院等建立设计合作' },
    { year: '2018', desc: '推出"胡桃禮"等原创系列，获多项设计大奖，品牌影响力持续攀升' },
    { year: '2023', desc: '全面升级全屋定制服务体系，服务家庭突破50000户' },
  ];

  return (
    <div>
      <div className="page-hero">
        <div className="hero-bg" style={{ background: 'linear-gradient(135deg, #3D2B1F, #5C3D2E)' }} />
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1>发展历程</h1>
          <p>从创立至今，每一步都是对品质的坚持</p>
        </div>
      </div>
      <div className="page-section">
        <div className="container">
          <div className="timeline">
            {milestones.map((m, i) => (
              <div key={i} className="timeline-item">
                <div className="year">{m.year}</div>
                <p>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}