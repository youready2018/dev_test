import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNews } from '../api';

export default function IndustryNewsPage() {
  const navigate = useNavigate();
  const [news, setNews] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchData = async (p: number) => {
    setLoading(true);
    try {
      const res: any = await getNews({ category: 'industry', page: p, page_size: 10 });
      setNews(res.items); setTotal(res.total);
    } finally { setLoading(false); }
  };
  useEffect(() => { fetchData(page); }, [page]);

  const totalPages = Math.ceil(total / 10);

  return (
    <div>
      <div className="hero-banner"><div className="hero-bg" /><div className="hero-overlay" />
        <div className="hero-content"><h1>行业资讯</h1><p>家居行业前沿动态与趋势</p></div></div>
      <div className="page-section"><div className="container">
        {loading ? <div style={{ textAlign: 'center', padding: 40 }}>加载中...</div> : (
          <>
            <div className="news-list">
              {news.map((n) => (
                <div key={n.id} className="news-item" onClick={() => navigate(`/news/detail/${n.id}`)}>
                  <div className="news-thumb" style={{ background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {n.cover_image ? <img src={n.cover_image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '[ 封面图 ]'}
                  </div>
                  <div className="news-content">
                    <h4>{n.title}</h4>
                    <p>{n.summary || n.content?.replace(/<[^>]*>/g, '').slice(0, 120)}</p>
                    <div className="news-date">{n.published_at || n.created_at}</div>
                  </div>
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 40 }}>
                <button disabled={page <= 1} onClick={() => setPage(page - 1)} style={{ padding: '8px 16px', border: '1px solid var(--border)', borderRadius: 6, background: '#fff', cursor: page <= 1 ? 'not-allowed' : 'pointer', opacity: page <= 1 ? 0.5 : 1 }}>上一页</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setPage(p)} style={{ padding: '8px 14px', border: '1px solid var(--border)', borderRadius: 6, background: p === page ? 'var(--primary)' : '#fff', color: p === page ? '#fff' : 'var(--text)', cursor: 'pointer' }}>{p}</button>
                ))}
                <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} style={{ padding: '8px 16px', border: '1px solid var(--border)', borderRadius: 6, background: '#fff', cursor: page >= totalPages ? 'not-allowed' : 'pointer', opacity: page >= totalPages ? 0.5 : 1 }}>下一页</button>
              </div>
            )}
          </>
        )}
      </div></div>
    </div>
  );
}