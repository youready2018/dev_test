// =============================================
// TP全屋家居 · 后台管理系统 - Vite 配置
// 功能：配置开发服务器端口、API 代理
// 说明：后台运行在 :3001，/api 请求代理到后端 :8000
// =============================================

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,               // 后台开发服务器端口 :3001
    proxy: {
      "/api": {
        target: "http://localhost:8000",  // 代理到 FastAPI 后端 :8000
        changeOrigin: true,
      },
    },
  },
})