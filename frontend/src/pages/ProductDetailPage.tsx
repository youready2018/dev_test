import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductDetail } from '../api';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getProductDetail(Number(id))
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page-section"><div className="container" style={{ textAlign: 'center', padding: 80 }}>加载中...</div></div>;
  if (!product) return <div className="page-section"><div className="container" style={{ textAlign: 'center', padding: 80 }}>产品不存在</div></div>;

  let specs: Record<string, string> = {};
  try { specs = typeof product.specifications === 'string' ? JSON.parse(product.specifications) : product.specifications || {}; } catch {}

  return (
    <div>
      <div className="hero-banner">
        <div className="hero-bg" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1>{product.name}</h1>
          <p>{product.series || product.product_code || '产品详情'}</p>
        </div>
      </div>

      <div className="page-section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start', marginBottom: 60 }}>
            {/* Gallery */}
            <div>
              <div style={{ aspectRatio: '4/3', background: 'var(--cream)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, overflow: 'hidden' }}>
                {product.cover_image ? (
                  <img src={product.cover_image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ color: 'var(--text-light)' }}>[ 产品图片 ]</span>
                )}
              </div>
              {(product.images || []).length > 0 && (
                <div style={{ display: 'flex', gap: 8 }}>
                  {product.images.map((img: any, i: number) => (
                    <div key={i} style={{ width: 80, height: 80, borderRadius: 6, background: 'var(--cream)', overflow: 'hidden', cursor: 'pointer', border: '2px solid transparent' }}>
                      {img.image_url ? <img src={img.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ padding: 24, textAlign: 'center', fontSize: 12, color: 'var(--text-light)' }}>图</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, marginBottom: 12 }}>{product.name}</h2>
              {product.series && <p style={{ color: 'var(--primary)', fontSize: 15, marginBottom: 8 }}>系列：{product.series}</p>}
              {product.product_code && <p style={{ color: 'var(--text-light)', fontSize: 13, marginBottom: 8 }}>产品编号：{product.product_code}</p>}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, marginTop: 20 }}>
                <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)' }}>{product.description || '暂无描述'}</p>
              </div>

              {Object.keys(specs).length > 0 && (
                <div style={{ marginTop: 24 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>规格参数</h3>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                    <tbody>
                      {Object.entries(specs).map(([k, v], i) => (
                        <tr key={i} style={{ background: i % 2 === 0 ? 'var(--cream)' : '#fff' }}>
                          <td style={{ padding: '8px 12px', color: 'var(--text-secondary)', width: 100 }}>{k}</td>
                          <td style={{ padding: '8px 12px' }}>{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
                <button className="btn-primary" onClick={() => navigate('/booking')}>免费预约量尺</button>
                <button className="btn-outline" onClick={() => navigate('/products')}>继续浏览</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}