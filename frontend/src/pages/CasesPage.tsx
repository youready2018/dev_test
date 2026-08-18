import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCases } from '../api';

const STYLES = ['全部', '现代', '轻奢', '简约', '新中式', '北欧', '工业'];

export default function CasesPage() {
  const navigate = useNavigate();
  const [cases, setCases] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [style, setStyle] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchData = async (p: number, s: string) => {
    setLoading(true);
    try {
      const res: any = await getCases({ page: p, page_size: 9, style: s || undefined });
      setCases(res.items); setTotal(res.total);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(page, style); }, [page, style]);

  const totalPages = Math.ceil(total / 9);

  return (
    <div>
      <div className="hero-banner">
        <div className="hero-bg" /><div className="hero-overlay" />
        <div className="hero-content">
          <h1>案例展示</h1>
          <p>真实客户案例，感受TP全屋家居的空间魅力</p>
        </div>
      </div>
      <div className="page-section">
        <div className="container">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 32 }}>
            {STYLES.map((s) => (
              <button key={s} onClick={() => { setStyle(s === '全部' ? '' : s); setPage(1); }}
                style={{
                  padding: '8px 20px', borderRadius: 20, border: '1px solid var(--border)',
                  background: (s === '全部' && !style) || style === s ? 'var(--primary)' : '#fff',
                  color: (s === '全部' && !style) || style === s ? '#fff' : 'var(--text)',
                  cursor: 'pointer', fontSize: 14,
                }}
              >{s}</button>
            ))}
          </div>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-light)' }}>加载中...</div>
          ) : (
            <>
              <div className="case-grid">
                {cases.map((c) => (
                  <div key={c.id} className="case-card" onClick={() => navigate(`/cases/detail/${c.id}`)}>
                    <div className="case-img" style={{ background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {c.cover_image ? <img src={c.cover_image} alt={c.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : `[ ${c.title} ]`}
                    </div>
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
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 40 }}>
                  <button disabled={page <= 1} onClick={() => setPage(page - 1)}
                    style={{ padding: '8px 16px', border: '1px solid var(--border)', borderRadius: 6, background: '#fff', cursor: page <= 1 ? 'not-allowed' : 'pointer', opacity: page <= 1 ? 0.5 : 1 }}>上一页</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button key={p} onClick={() => setPage(p)}
                      style={{ padding: '8px 14px', border: '1px solid var(--border)', borderRadius: 6, background: p === page ? 'var(--primary)' : '#fff', color: p === page ? '#fff' : 'var(--text)', cursor: 'pointer' }}>{p}</button>
                  ))}
                  <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}
                    style={{ padding: '8px 16px', border: '1px solid var(--border)', borderRadius: 6, background: '#fff', cursor: page >= totalPages ? 'not-allowed' : 'pointer', opacity: page >= totalPages ? 0.5 : 1 }}>下一页</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}