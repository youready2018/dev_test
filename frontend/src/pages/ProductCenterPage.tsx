import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, getCategories } from '../api';

export default function ProductCenterPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [categoryId, setCategoryId] = useState<number | undefined>();
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { getCategories().then(setCategories); }, []);

  const fetchProducts = async (p: number, cid?: number, q?: string) => {
    setLoading(true);
    try {
      const res: any = await getProducts({ page: p, page_size: 12, category_id: cid, search: q || undefined });
      setProducts(res.items); setTotal(res.total);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(page, categoryId, search); }, [page, categoryId]);

  const handleSearch = (val: string) => { setSearch(val); setPage(1); fetchProducts(1, categoryId, val); };

  const totalPages = Math.ceil(total / 12);

  return (
    <div>
      <div className="hero-banner">
        <div className="hero-bg" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1>产品中心</h1>
          <p>匠心品质 · 原创设计 · 全屋定制</p>
        </div>
      </div>

      <div className="page-section">
        <div className="container">
          {/* Category Tabs */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 32 }}>
            <button
              onClick={() => { setCategoryId(undefined); setPage(1); }}
              style={{
                padding: '8px 20px', borderRadius: 20, border: '1px solid var(--border)',
                background: !categoryId ? 'var(--primary)' : '#fff',
                color: !categoryId ? '#fff' : 'var(--text)', cursor: 'pointer', fontSize: 14,
              }}
            >全部</button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => { setCategoryId(c.id); setPage(1); }}
                style={{
                  padding: '8px 20px', borderRadius: 20, border: '1px solid var(--border)',
                  background: categoryId === c.id ? 'var(--primary)' : '#fff',
                  color: categoryId === c.id ? '#fff' : 'var(--text)', cursor: 'pointer', fontSize: 14,
                }}
              >{c.name}</button>
            ))}
          </div>

          {/* Search */}
          <div style={{ maxWidth: 400, margin: '0 auto 32px' }}>
            <input
              placeholder="搜索产品名称..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              style={{
                width: '100%', padding: '10px 16px', borderRadius: 24,
                border: '1px solid var(--border)', fontSize: 14, outline: 'none',
                boxSizing: 'border-box', textAlign: 'center',
              }}
            />
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-light)' }}>加载中...</div>
          ) : (
            <>
              <div className="product-grid">
                {products.length === 0 && (
                  <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 40, color: 'var(--text-light)' }}>
                    暂无产品
                  </div>
                )}
                {products.map((p) => (
                  <div key={p.id} className="product-card" onClick={() => navigate(`/products/detail/${p.id}`)}>
                    <div className="product-img" style={{ background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-light)' }}>
                      {p.cover_image ? <img src={p.cover_image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : `[ ${p.name} ]`}
                    </div>
                    <div className="product-body">
                      <h4>{p.name}</h4>
                      {p.series && <p style={{ fontSize: 13, color: 'var(--text-light)' }}>{p.series}</p>}
                      {p.product_code && <p style={{ fontSize: 12, color: 'var(--primary)' }}>编号：{p.product_code}</p>}
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
                      style={{
                        padding: '8px 14px', border: '1px solid var(--border)', borderRadius: 6,
                        background: p === page ? 'var(--primary)' : '#fff',
                        color: p === page ? '#fff' : 'var(--text)', cursor: 'pointer',
                      }}>{p}</button>
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