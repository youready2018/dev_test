import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBanners, getCategories, getProducts, getCases, getNews, getSettings } from '../api';

export default function HomePage() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [banners, setBanners] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      getBanners(), getCategories(), getProducts({ page: 1, page_size: 4 }),
      getCases({ page: 1, page_size: 3 }), getNews({ page: 1, page_size: 3 }),
      getSettings(),
    ]).then(([b, c, p, ca, n, s]) => {
      setBanners(b as any[]);
      setCategories(c as any[]);
      setProducts((p as any).items || []);
      setCases((ca as any).items || []);
      setNews((n as any).items || []);
      setSettings(s as Record<string, string>);
      setLoaded(true);
    });
  }, []);

  const slides = banners.length > 0 ? banners : [{ title: 'TP 全屋家居', image_url: '' }];
  const totalSlides = slides.length;

  const goToSlide = useCallback((i: number) => setCurrentSlide((i + totalSlides) % totalSlides), [totalSlides]);
  const nextSlide = useCallback(() => goToSlide(currentSlide + 1), [currentSlide, goToSlide]);
  const prevSlide = useCallback(() => goToSlide(currentSlide - 1), [currentSlide, goToSlide]);
  useEffect(() => { const t = setInterval(nextSlide, 5000); return () => clearInterval(t); }, [nextSlide]);

  // Helper: navigate based on button config
  const handleNav = (link?: string) => {
    if (!link) return;
    if (link.startsWith('http')) window.location.href = link;
    else navigate(link);
  };

  return (
    <div>
      {/* Carousel — 完全由 API 数据驱动，匹配原型效果 */}
      <div className="carousel">
        <div className="carousel-inner">
          {slides.map((s, i) => (
            <div key={i} className={`carousel-slide${i === currentSlide ? ' active' : ''}`}>
              {/* 背景图：优先 image_url，无图片时使用渐变色 fallback */}
              <div className="bg" style={{
                background: s.image_url
                  ? `url(${s.image_url}) center/cover no-repeat, linear-gradient(135deg, #3D2B1F, #5C3D2E)`
                  : 'linear-gradient(135deg, #3D2B1F, #5C3D2E)',
              }} />
              <div className="overlay" />
              <div className="content">
                {/* 标签徽章（如：匠心品质·原创设计 / 新品推荐 / 全屋定制 / 限时活动） */}
                {s.tag_text && <div className="tag">{s.tag_text}</div>}

                {/* 副标题 */}
                {s.subtitle && <div className="subtitle">{s.subtitle}</div>}

                {/* 主标题（支持 <br> 换行） */}
                <h1 dangerouslySetInnerHTML={{ __html: s.title || 'TP 全屋家居' }} />

                {/* 描述文字（支持 <br> 换行） */}
                {s.description && (
                  <p dangerouslySetInnerHTML={{ __html: s.description }} />
                )}

                {/* 按钮区域 — 每张轮播图的不同按钮配置 */}
                <div className="actions">
                  {s.btn_primary_text && (
                    <button className="btn-primary" onClick={() => handleNav(s.btn_primary_link)}>
                      {s.btn_primary_text}
                    </button>
                  )}
                  {s.btn_outline_text && (
                    <button className="btn-outline-light" onClick={() => handleNav(s.btn_outline_link)}>
                      {s.btn_outline_text}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 左右箭头 */}
        <button className="carousel-arrow prev" onClick={prevSlide}>❮</button>
        <button className="carousel-arrow next" onClick={nextSlide}>❯</button>

        {/* 指示点 */}
        <div className="carousel-dots">
          {slides.map((_, i) => (
            <span key={i} className={i === currentSlide ? 'active' : ''} onClick={() => goToSlide(i)} />
          ))}
        </div>
      </div>

      <div className="page-section">
        <div className="container">
          {/* Brand Intro */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center', marginBottom: 60 }}>
            <div style={{ aspectRatio: '4/3', background: 'var(--cream)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-light)', fontSize: 14 }}>[ 品牌形象图 ]</div>
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 26, marginBottom: 16, color: 'var(--dark)' }}>匠心制造 · 原创设计</h2>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8 }}>{settings.company_intro?.replace(/<[^>]*>/g, '') || 'TP全屋家居，集设计、研发、生产、销售于一体的综合性全屋定制家具企业。'}</p>
              <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
                <button className="btn-primary" onClick={() => navigate('/about')}>了解更多</button>
                <button className="btn-outline" onClick={() => navigate('/products')}>浏览产品</button>
              </div>
            </div>
          </div>

          {/* Features */}
          <h2 className="section-title">核心优势</h2>
          <p className="section-subtitle">四大核心能力，铸就品质家居</p>
          <div className="features">
            {[
              { icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z', title: '原创设计', desc: '50余人专业设计团队，累计设计专利200余项' },
              { icon: 'M9 3v2m6-2v2M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2zm2 10h10l-2 8H9l-2-8z', title: '人体工程学', desc: '深入研究人体曲线，每件产品都经过舒适度测试' },
              { icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0...', title: '智能化生产线', desc: '引进德国、意大利先进生产线，精度达毫米级' },
              { icon: 'M18.364 5.636a9 9 0 010 12.728m-12.728 0...', title: '贴心售后服务', desc: '5年质保，终身维护，全国300+服务网点' },
            ].map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-icon">
                  <svg viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}><path d={f.icon} /></svg>
                </div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="stats">
            {[
              { num: '200+', label: '设计专利' },
              { num: '50,000㎡', label: '生产基地' },
              { num: '50,000+', label: '服务家庭' },
              { num: '20年', label: '行业经验' },
            ].map((s, i) => (
              <div key={i} className="stat-item">
                <h3>{s.num}</h3>
                <p>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Categories / Products */}
          <h2 className="section-title">产品系列</h2>
          <p className="section-subtitle">按空间分类，一站式全屋家居解决方案</p>
          <div className="product-grid" style={{ marginBottom: 60 }}>
            {(categories.length > 0 ? categories : [
              { name: '客厅家具', slug: 'living-room' },
              { name: '卧室家具', slug: 'bedroom' },
              { name: '书房家具', slug: 'study' },
              { name: '餐厅家具', slug: 'dining-room' },
            ]).slice(0, 4).map((c, i) => (
              <div key={i} className="product-card" onClick={() => navigate('/products')}>
                <div className="product-img">[ {c.name} ]</div>
                <div className="product-body"><h4 style={{ textAlign: 'center' }}>{c.name}</h4></div>
              </div>
            ))}
          </div>

          {/* Cases */}
          <h2 className="section-title">精选案例</h2>
          <p className="section-subtitle">真实客户案例，感受TP全屋家居的空间魅力</p>
          <div className="case-grid" style={{ marginBottom: 60 }}>
            {(cases.length > 0 ? cases : []).map((c, i) => (
              <div key={i} className="case-card" onClick={() => navigate(`/cases/detail/${c.id}`)}>
                <div className="case-img">[ {c.title} ]</div>
                <div className="case-body">
                  <h4>{c.title}</h4>
                  <div className="case-tags">
                    {c.style && <span>{c.style}</span>}
                    {c.area && <span>{c.area}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* News */}
          <h2 className="section-title">新闻动态</h2>
          <p className="section-subtitle">了解TP全屋家居最新动态与行业资讯</p>
          <div className="news-list" style={{ marginBottom: 40 }}>
            {(news.length > 0 ? news : []).map((n, i) => (
              <div key={i} className="news-item" onClick={() => navigate(`/news/detail/${n.id}`)}>
                <div className="news-thumb">[ 封面图 ]</div>
                <div className="news-content">
                  <h4>{n.title}</h4>
                  <p>{n.summary || n.content?.replace(/<[^>]*>/g, '').slice(0, 120)}</p>
                  <div className="news-date">{n.published_at || n.created_at}</div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ background: 'linear-gradient(135deg, var(--dark-soft), var(--dark))', borderRadius: 'var(--radius-lg)', padding: '60px 40px', textAlign: 'center', color: '#fff' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, marginBottom: 12, color: '#fff' }}>免费预约量尺 · 一对一专属服务</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 24 }}>专业设计师上门量尺，根据您的需求定制全屋家具方案</p>
            <button className="btn-primary" onClick={() => navigate('/booking')} style={{ fontSize: 16, padding: '12px 36px' }}>立即预约</button>
          </div>
        </div>
      </div>
    </div>
  );
}