import { useState, useEffect } from 'react';
import { getSettings, submitMessage } from '../api';

export default function ContactPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [form, setForm] = useState({ name: '', phone: '', content: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { getSettings().then(setSettings); }, []);

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.content) {
      alert('请填写姓名、手机号和留言内容');
      return;
    }
    setSubmitting(true);
    try {
      await submitMessage(form);
      alert('留言提交成功，我们会尽快回复您');
      setForm({ name: '', phone: '', content: '' });
    } catch {
      alert('提交失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  const contactItems = [
    { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z', label: '公司地址', value: settings.address || '广东省深圳市南山区科技园南区TP大厦' },
    { icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', label: '联系电话', value: settings.phone || '400-888-8888' },
    { icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', label: '电子邮箱', value: settings.email || 'contact@tp-home.com' },
  ];

  return (
    <div>
      <div className="hero-banner">
        <div className="hero-bg" style={{ background: 'linear-gradient(135deg, #3D2B1F, #5C3D2E)' }} />
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1>联系我们</h1>
          <p>期待与您的沟通，为您提供最优质的家居服务</p>
        </div>
      </div>
      <div className="page-section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
            <div style={{ background: 'var(--white)', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)', padding: 32 }}>
              <h3 style={{ fontSize: 18, marginBottom: 20 }}>联系方式</h3>
              {contactItems.map((c, i) => (
                <div key={i} style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24, flexShrink: 0, marginTop: 2 }}><path d={c.icon} /></svg>
                  <div><strong style={{ fontSize: 14 }}>{c.label}</strong><p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{c.value}</p></div>
                </div>
              ))}
              <div style={{ marginTop: 24 }}>
                <h4 style={{ fontSize: 14, marginBottom: 12 }}>社交媒体</h4>
                <div style={{ display: 'flex', gap: 12 }}>
                  {['微信', '视频号', '抖音', '小红书'].map((s, i) => (
                    <span key={i} style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer' }}>{s}</span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div style={{ aspectRatio: '16/9', background: 'var(--cream)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-light)', fontSize: 14, marginBottom: 24 }}>[ 地图占位 ]</div>
              <div style={{ background: 'var(--white)', borderRadius: 'var(--radius)', border: '1px solid var(--border-light)', padding: 24 }}>
                <h3 style={{ fontSize: 16, marginBottom: 16 }}>在线留言</h3>
                <div className="form-group">
                  <label>姓名 *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="请输入姓名" />
                </div>
                <div className="form-group">
                  <label>手机号 *</label>
                  <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="请输入手机号" />
                </div>
                <div className="form-group">
                  <label>留言内容 *</label>
                  <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="请输入您的留言内容..." />
                </div>
                <button className="btn-primary" onClick={handleSubmit} disabled={submitting}
                  style={{ width: '100%', justifyContent: 'center', background: submitting ? '#ccc' : undefined }}>
                  {submitting ? '提交中...' : '提交留言'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}