import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNewsDetail, getNews } from '../api';

export default function NewsDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getNewsDetail(Number(id)).then((a: any) => {
      setArticle(a);
      getNews({ category: a.category, page: 1, page_size: 5 }).then((res: any) => {
        setRelated((res.items || []).filter((n: any) => n.id !== a.id).slice(0, 3));
      });
    }).catch(() => setArticle(null)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page-section"><div className="container" style={{ textAlign: 'center', padding: 80 }}>加载中...</div></div>;
  if (!article) return <div className="page-section"><div className="container" style={{ textAlign: 'center', padding: 80 }}>文章不存在</div></div>;

  return (
    <div>
      <div className="hero-banner"><div className="hero-bg" /><div className="hero-overlay" />
        <div className="hero-content"><h1>{article.title}</h1><p>{article.published_at || article.created_at}</p></div></div>
      <div className="page-section">
        <div className="container" style={{ maxWidth: 800 }}>
          <div style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 32 }}>
            {article.category === 'enterprise' ? '企业新闻' : '行业资讯'} · {article.published_at || article.created_at}
            {article.source && ` · 来源：${article.source}`}
          </div>
          <div style={{ lineHeight: 2, fontSize: 15, color: 'var(--text)' }}
            dangerouslySetInnerHTML={{ __html: article.content || article.summary || '' }} />

          {related.length > 0 && (
            <div style={{ marginTop: 60, borderTop: '1px solid var(--border)', paddingTop: 40 }}>
              <h3 style={{ fontSize: 18, marginBottom: 20 }}>相关文章</h3>
              <div style={{ display: 'grid', gap: 16 }}>
                {related.map((n) => (
                  <div key={n.id} className="news-item" onClick={() => navigate(`/news/detail/${n.id}`)}>
                    <div className="news-thumb" style={{ background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {n.cover_image ? <img src={n.cover_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '[ 封面图 ]'}
                    </div>
                    <div className="news-content">
                      <h4>{n.title}</h4>
                      <p>{n.summary?.slice(0, 80)}</p>
                      <div className="news-date">{n.published_at}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}