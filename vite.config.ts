import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'api': fileURLToPath(new URL('./src/api', import.meta.url))
    }
  },
  server: {
    https: false, // 是否开启 https
    open: true, // 是否自动在浏览器打开
    cors: true, // 允许跨域 
    port: 8999, // 端口号
    host: "0.0.0.0",
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5000", // 后台接口
        changeOrigin: true,
        secure: false, // 如果是https接口，需要配置这个参数
        ws: false, //websocket支持
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    }
  }
})
