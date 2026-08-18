// =============================================
// TP全屋家居 · 后台 - API 调用层
// 功能：封装所有后台 API 请求
// =============================================

import axios from 'axios';

const api = axios.create({
  baseURL: '/api/admin',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

// === 认证 ===
export const authAPI = {
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),
  me: () => api.get('/auth/me'),
};

// === 仪表盘 ===
export const dashboardAPI = {
  getStats: () => api.get('/dashboard'),
};

// === 产品管理 ===
export const productAPI = {
  list: (params?: any) => api.get('/products', { params }),
  get: (id: number) => api.get(`/products/${id}`),
  create: (data: any) => api.post('/products', data),
  update: (id: number, data: any) => api.put(`/products/${id}`, data),
  delete: (id: number) => api.delete(`/products/${id}`),
};

// === 分类管理 ===
export const categoryAPI = {
  list: () => api.get('/categories'),
  create: (data: any) => api.post('/categories', data),
  update: (id: number, data: any) => api.put(`/categories/${id}`, data),
  delete: (id: number) => api.delete(`/categories/${id}`),
};

// === 案例管理 ===
export const caseAPI = {
  list: (params?: any) => api.get('/cases', { params }),
  get: (id: number) => api.get(`/cases/${id}`),
  create: (data: any) => api.post('/cases', data),
  update: (id: number, data: any) => api.put(`/cases/${id}`, data),
  delete: (id: number) => api.delete(`/cases/${id}`),
};

// === 新闻管理 ===
export const newsAPI = {
  list: (params?: any) => api.get('/news', { params }),
  get: (id: number) => api.get(`/news/${id}`),
  create: (data: any) => api.post('/news', data),
  update: (id: number, data: any) => api.put(`/news/${id}`, data),
  delete: (id: number) => api.delete(`/news/${id}`),
};

// === 预约管理 ===
export const appointmentAPI = {
  list: (params?: any) => api.get('/appointments', { params }),
  get: (id: number) => api.get(`/appointments/${id}`),
  update: (id: number, data: any) => api.patch(`/appointments/${id}`, data),
};

// === 留言管理 ===
export const messageAPI = {
  list: (params?: any) => api.get('/messages', { params }),
  get: (id: number) => api.get(`/messages/${id}`),
  reply: (id: number, data: any) => api.patch(`/messages/${id}`, data),
};

// === 招聘管理 ===
export const jobAPI = {
  list: (params?: any) => api.get('/jobs', { params }),
  get: (id: number) => api.get(`/jobs/${id}`),
  create: (data: any) => api.post('/jobs', data),
  update: (id: number, data: any) => api.put(`/jobs/${id}`, data),
  delete: (id: number) => api.delete(`/jobs/${id}`),
};

// === 用户管理 ===
export const userAPI = {
  list: () => api.get('/users'),
  create: (data: any) => api.post('/users', data),
  update: (id: number, data: any) => api.put(`/users/${id}`, data),
  toggleStatus: (id: number, is_active: boolean) =>
    api.put(`/users/${id}/status`, { is_active }),
};

// === 网站设置 + 轮播图 ===
export const settingAPI = {
  get: () => api.get('/settings'),
  update: (data: any) => api.put('/settings', data),
};

export const bannerAPI = {
  list: () => api.get('/banners'),
  create: (data: any) => api.post('/banners', data),
  update: (id: number, data: any) => api.put(`/banners/${id}`, data),
  delete: (id: number) => api.delete(`/banners/${id}`),
};

// === 文件上传 ===
export const uploadAPI = {
  upload: (file: File, subDir = 'images') => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('sub_dir', subDir);
    return api.post('/upload', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default api;