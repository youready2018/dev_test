// =============================================
// TP全屋家居 · 前台 - API 调用层（Phase 5）
// =============================================

import axios from 'axios';

const api = axios.create({ baseURL: '/api', timeout: 15000 });
api.interceptors.response.use((res) => res.data, (err) => {
  const msg = err.response?.data?.detail || '请求失败';
  console.error('[API]', msg);
  return Promise.reject(err);
});

// === 分类 ===
export const getCategories = () => api.get('/categories') as Promise<any[]>;

// === 产品 ===
export const getProducts = (params?: { category_id?: number; search?: string; page?: number; page_size?: number }) =>
  api.get('/products', { params }) as Promise<{ items: any[]; total: number; page: number; page_size: number }>;
export const getProductDetail = (id: number) => api.get(`/products/${id}`) as Promise<any>;

// === 案例 ===
export const getCases = (params?: { style?: string; page?: number; page_size?: number }) =>
  api.get('/cases', { params }) as Promise<{ items: any[]; total: number; page: number; page_size: number }>;
export const getCaseDetail = (id: number) => api.get(`/cases/${id}`) as Promise<any>;

// === 新闻 ===
export const getNews = (params?: { category?: string; page?: number; page_size?: number }) =>
  api.get('/news', { params }) as Promise<{ items: any[]; total: number; page: number; page_size: number }>;
export const getNewsDetail = (id: number) => api.get(`/news/${id}`) as Promise<any>;

// === 职位 ===
export const getJobs = (params?: { category?: string; department?: string; page?: number; page_size?: number }) =>
  api.get('/jobs', { params }) as Promise<{ items: any[]; total: number; page: number; page_size: number }>;
export const getJobDetail = (id: number) => api.get(`/jobs/${id}`) as Promise<any>;

// === 轮播图 & 设置 ===
export const getBanners = () => api.get('/banners') as Promise<any[]>;
export const getSettings = () => api.get('/settings') as Promise<Record<string, string>>;

// === 提交表单 ===
export const submitAppointment = (data: {
  name: string; phone: string; city?: string; address?: string;
  appointment_date?: string; time_slot?: string; remark?: string;
}) => api.post('/appointments', data) as Promise<any>;

export const submitMessage = (data: { name: string; phone: string; content: string }) =>
  api.post('/messages', data) as Promise<any>;

export const submitApplication = (jobId: number, formData: FormData) =>
  api.post(`/jobs/${jobId}/applications`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }) as Promise<any>;

export default api;