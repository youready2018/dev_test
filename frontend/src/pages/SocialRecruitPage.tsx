import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getJobs } from '../api';

export default function SocialRecruitPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJobs({ category: 'social', page: 1, page_size: 50 }).then((res: any) => {
      setJobs(res.items || []);
    }).finally(() => setLoading(false));
  }, []);

  const departments = [...new Set(jobs.map((j) => j.department).filter(Boolean))];

  return (
    <div>
      <div className="hero-banner"><div className="hero-bg" /><div className="hero-overlay" />
        <div className="hero-content"><h1>社会招聘</h1><p>加入TP，共创未来</p></div></div>
      <div className="page-section"><div className="container">
        {loading ? <div style={{ textAlign: 'center', padding: 40 }}>加载中...</div> : (
          departments.length > 0 ? departments.map((dept) => {
            const deptJobs = jobs.filter((j) => j.department === dept);
            return (
              <div key={dept} style={{ marginBottom: 48 }}>
                <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 20, paddingBottom: 12, borderBottom: '2px solid var(--primary)' }}>{dept}</h3>
                <div style={{ display: 'grid', gap: 16 }}>
                  {deptJobs.map((job) => (
                    <div key={job.id} className="job-card" onClick={() => navigate(`/jobs/detail/${job.id}`)}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                        <div>
                          <h4 style={{ fontSize: 16, fontWeight: 600 }}>{job.title}</h4>
                          <p style={{ fontSize: 13, color: 'var(--text-light)', marginTop: 4 }}>
                            {job.location} · {job.salary_range || '薪资面议'}
                          </p>
                        </div>
                        <button className="btn-outline" style={{ padding: '6px 20px', fontSize: 13 }} onClick={(e) => { e.stopPropagation(); navigate(`/jobs/detail/${job.id}`); }}>查看详情</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }) : <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-light)' }}>暂无招聘职位</div>
        )}
      </div></div>
    </div>
  );
}