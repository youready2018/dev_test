import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,               // 前台开发服务器端口 :3000
    proxy: {
      "/api": {
        target: "http://localhost:8000",  // 代理到 FastAPI 后端 :8000
        changeOrigin: true,
      },
    },
  },
})