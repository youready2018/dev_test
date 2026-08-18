import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCaseDetail, getProducts } from '../api';

export default function CaseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getCaseDetail(Number(id)).then((d: any) => {
      setDetail(d);
      if (d.product_ids?.length > 0) {
        getProducts({ page: 1, page_size: 10 }).then((res: any) => {
          setRelatedProducts((res.items || []).filter((p: any) => d.product_ids.includes(p.id)));
        });
      }
    }).catch(() => setDetail(null)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page-section"><div className="container" style={{ textAlign: 'center', padding: 80 }}>加载中...</div></div>;
  if (!detail) return <div className="page-section"><div className="container" style={{ textAlign: 'center', padding: 80 }}>案例不存在</div></div>;

  return (
    <div>
      <div className="hero-banner">
        <div className="hero-bg" /><div className="hero-overlay" />
        <div className="hero-content">
          <h1>{detail.title}</h1>
          <p>{detail.style} · {detail.area}</p>
        </div>
      </div>
      <div className="page-section">
        <div className="container">
          {/* Gallery */}
          <div className="case-detail-gallery">
            {(detail.images || []).length > 0 ? detail.images.map((img: any, i: number) => (
              <div key={i} style={{ aspectRatio: '16/9', background: 'var(--cream)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                {img.image_url ? <img src={img.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ padding: 60, textAlign: 'center', color: 'var(--text-light)' }}>[ 效果图 {i + 1} ]</div>}
              </div>
            )) : (
              <div style={{ aspectRatio: '16/9', background: 'var(--cream)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-light)' }}>[ 案例效果图 ]</div>
            )}
          </div>

          {/* Info */}
          <div style={{ maxWidth: 800, margin: '40px auto' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 26, marginBottom: 16 }}>{detail.title}</h2>
            <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
              {detail.style && <span style={{ padding: '4px 14px', borderRadius: 16, background: 'var(--cream)', fontSize: 13 }}>{detail.style}</span>}
              {detail.area && <span style={{ padding: '4px 14px', borderRadius: 16, background: 'var(--cream)', fontSize: 13 }}>{detail.area}</span>}
            </div>
            {detail.description && (
              <div style={{ lineHeight: 1.8, color: 'var(--text-secondary)' }} dangerouslySetInnerHTML={{ __html: detail.description }} />
            )}
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <>
              <h2 className="section-title">相关产品</h2>
              <div className="related-grid">
                {relatedProducts.map((p: any) => (
                  <div key={p.id} className="product-card" onClick={() => navigate(`/products/detail/${p.id}`)}>
                    <div className="product-img" style={{ background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {p.cover_image ? <img src={p.cover_image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : `[ ${p.name} ]`}
                    </div>
                    <div className="product-body"><h4>{p.name}</h4></div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}