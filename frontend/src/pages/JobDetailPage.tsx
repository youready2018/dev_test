import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getJobDetail, submitApplication } from '../api';

export default function JobDetailPage() {
  const { id } = useParams();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [form, setForm] = useState({ applicant_name: '', phone: '', email: '', cover_letter: '' });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getJobDetail(Number(id)).then(setJob).catch(() => setJob(null)).finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async () => {
    if (!form.applicant_name || !form.phone || !form.email) {
      message.warning('请填写姓名、电话和邮箱');
      return;
    }
    setApplying(true);
    try {
      const fd = new FormData();
      fd.append('applicant_name', form.applicant_name);
      fd.append('phone', form.phone);
      fd.append('email', form.email);
      if (form.cover_letter) fd.append('cover_letter', form.cover_letter);
      if (file) fd.append('resume', file);
      await submitApplication(Number(id), fd);
      alert('简历投递成功！');
      setForm({ applicant_name: '', phone: '', email: '', cover_letter: '' });
      setFile(null);
    } catch {
      alert('投递失败，请重试');
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <div className="page-section"><div className="container" style={{ textAlign: 'center', padding: 80 }}>加载中...</div></div>;
  if (!job) return <div className="page-section"><div className="container" style={{ textAlign: 'center', padding: 80 }}>职位不存在或已关闭</div></div>;

  return (
    <div>
      <div className="hero-banner"><div className="hero-bg" /><div className="hero-overlay" />
        <div className="hero-content"><h1>{job.title}</h1><p>{job.department} · {job.location}</p></div></div>
      <div className="page-section">
        <div className="container" style={{ maxWidth: 900 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 48, alignItems: 'start' }}>
            {/* Main Content */}
            <div>
              {job.responsibilities && (
                <div style={{ marginBottom: 32 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, color: 'var(--primary)' }}>岗位职责</h3>
                  <div style={{ lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{job.responsibilities}</div>
                </div>
              )}
              {job.requirements && (
                <div style={{ marginBottom: 32 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, color: 'var(--primary)' }}>任职要求</h3>
                  <div style={{ lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{job.requirements}</div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div style={{ position: 'sticky', top: 100 }}>
              <div style={{ background: 'var(--cream)', borderRadius: 'var(--radius)', padding: 24, marginBottom: 20 }}>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 13, color: 'var(--text-light)', marginBottom: 4 }}>薪资范围</div>
                  <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--primary)' }}>{job.salary_range || '面议'}</div>
                </div>
                <div style={{ display: 'grid', gap: 8, fontSize: 14, color: 'var(--text-secondary)' }}>
                  {job.location && <div>📍 {job.location}</div>}
                  {job.department && <div>🏢 {job.department}</div>}
                  {job.headcount && <div>👥 招聘 {job.headcount} 人</div>}
                  {job.deadline && <div>⏰ 截止 {job.deadline}</div>}
                </div>
              </div>

              {/* Application Form */}
              <div style={{ background: '#fff', borderRadius: 'var(--radius)', padding: 24, border: '1px solid var(--border)' }}>
                <h4 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>投递简历</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <input placeholder="姓名 *" value={form.applicant_name} onChange={(e) => setForm({ ...form, applicant_name: e.target.value })}
                    style={{ padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 14, outline: 'none' }} />
                  <input placeholder="手机号 *" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    style={{ padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 14, outline: 'none' }} />
                  <input placeholder="邮箱 *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    style={{ padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 14, outline: 'none' }} />
                  <textarea placeholder="求职信（可选）" value={form.cover_letter} onChange={(e) => setForm({ ...form, cover_letter: e.target.value })}
                    rows={3} style={{ padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 6, fontSize: 14, outline: 'none', resize: 'vertical' }} />
                  <div>
                    <label style={{ display: 'block', fontSize: 13, color: 'var(--text-light)', marginBottom: 4 }}>上传简历 (PDF/Word)</label>
                    <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files?.[0] || null)}
                      style={{ fontSize: 13 }} />
                  </div>
                  <button onClick={handleSubmit} disabled={applying}
                    style={{
                      padding: '12px', background: applying ? '#ccc' : 'var(--primary)', color: '#fff',
                      border: 'none', borderRadius: 6, cursor: applying ? 'not-allowed' : 'pointer',
                      fontSize: 15, fontWeight: 500, marginTop: 4,
                    }}>
                    {applying ? '投递中...' : '立即投递'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}