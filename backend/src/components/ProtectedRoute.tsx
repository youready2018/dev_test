// =============================================
// TP全屋家居 · 后台 - 路由守卫组件（Phase 4.1）
// 功能：检查 JWT Token 是否存在，无 Token 自动跳转登录页
// =============================================
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('admin_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}