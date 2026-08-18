import { useState } from 'react';
import { submitAppointment } from '../api';

export default function BookingPage() {
  const [form, setForm] = useState({
    name: '', phone: '', city: '', address: '',
    appointment_date: '', time_slot: '', remark: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.phone) {
      alert('请填写姓名和联系电话');
      return;
    }
    setSubmitting(true);
    try {
      await submitAppointment(form);
      alert('预约提交成功！我们将在24小时内与您联系');
      setForm({ name: '', phone: '', city: '', address: '', appointment_date: '', time_slot: '', remark: '' });
    } catch {
      alert('提交失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  const update = (key: string, val: string) => setForm({ ...form, [key]: val });

  return (
    <div>
      <div className="hero-banner">
        <div className="hero-bg" style={{ background: 'linear-gradient(135deg, #3D2B1F, #5C3D2E)' }} />
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1>在线预约</h1>
          <p>专业设计师上门量尺，一对一沟通需求，为您量身定制全屋家具方案</p>
        </div>
      </div>
      <div className="page-section">
        <div className="container">
          <div className="booking-form">
            <div className="form-row">
              <div className="form-group">
                <label>您的姓名 *</label>
                <input value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="请输入姓名" />
              </div>
              <div className="form-group">
                <label>联系电话 *</label>
                <input type="tel" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="请输入手机号" />
              </div>
            </div>
            <div className="form-group">
              <label>所在城市</label>
              <input value={form.city} onChange={(e) => update('city', e.target.value)} placeholder="如：深圳" />
            </div>
            <div className="form-group">
              <label>预约地址</label>
              <input value={form.address} onChange={(e) => update('address', e.target.value)} placeholder="请填写详细地址" />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>期望预约日期</label>
                <input type="date" value={form.appointment_date} onChange={(e) => update('appointment_date', e.target.value)} />
              </div>
              <div className="form-group">
                <label>期望时间</label>
                <select value={form.time_slot} onChange={(e) => update('time_slot', e.target.value)}>
                  <option value="">请选择时间段</option>
                  <option value="上午">上午 9:00-12:00</option>
                  <option value="下午">下午 14:00-17:00</option>
                  <option value="傍晚">傍晚 17:00-20:00</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>备注说明</label>
              <textarea value={form.remark} onChange={(e) => update('remark', e.target.value)}
                placeholder="请描述您的需求，如感兴趣的产品、空间面积等" />
            </div>
            <button className="btn-primary" onClick={handleSubmit} disabled={submitting}
              style={{ width: '100%', justifyContent: 'center', padding: 12, background: submitting ? '#ccc' : undefined }}>
              {submitting ? '提交中...' : '提交预约申请'}
            </button>
            <p style={{ fontSize: 12, color: 'var(--text-light)', textAlign: 'center', marginTop: 12 }}>提交后，客服将在 24 小时内与您联系确认</p>
          </div>
        </div>
      </div>
    </div>
  );
}