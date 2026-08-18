// =============================================
// TP全屋家居 · 后台 - 登录页（Phase 4.1）
// =============================================
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { authAPI } from '../api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      message.warning('请输入用户名和密码');
      return;
    }
    setLoading(true);
    try {
      const res: any = await authAPI.login(username, password);
      localStorage.setItem('admin_token', res.access_token);
      localStorage.setItem('admin_user', JSON.stringify(res.user));
      message.success(`欢迎回来，${res.user.real_name}`);
      navigate('/admin');
    } catch {
      message.error('用户名或密码错误');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #2C1810 0%, #1A1410 100%)',
    }}>
      <div style={{
        width: 400,
        padding: '48px 40px',
        background: '#fff',
        borderRadius: 12,
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: '#B88846', display: 'inline-flex',
            alignItems: 'center', justifyContent: 'center',
            marginBottom: 16,
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: 28, height: 28 }}>
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: '#2D2A24', margin: 0 }}>TP 管理后台</h1>
          <p style={{ fontSize: 14, color: '#999', marginTop: 4 }}>全屋家居管理系统</p>
        </div>

        {/* 表单 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: '#666', marginBottom: 6 }}>用户名</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="请输入用户名"
              style={{
                width: '100%', padding: '10px 14px', fontSize: 14,
                border: '1px solid #E8E3DE', borderRadius: 6,
                outline: 'none', boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#B88846')}
              onBlur={(e) => (e.target.style.borderColor = '#E8E3DE')}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: '#666', marginBottom: 6 }}>密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="请输入密码"
              style={{
                width: '100%', padding: '10px 14px', fontSize: 14,
                border: '1px solid #E8E3DE', borderRadius: 6,
                outline: 'none', boxSizing: 'border-box',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#B88846')}
              onBlur={(e) => (e.target.style.borderColor = '#E8E3DE')}
            />
          </div>
          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: '100%', padding: '12px', fontSize: 15,
              background: loading ? '#ccc' : '#B88846',
              color: '#fff', border: 'none', borderRadius: 6,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 500, marginTop: 8,
              transition: 'background 0.2s',
            }}
          >
            {loading ? '登录中...' : '登 录'}
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: '#bbb' }}>
          默认账号: admin / admin123
        </div>
      </div>
    </div>
  );
}