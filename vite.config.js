import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, '', '')

  console.log(`🚀 Building for ${mode} mode`)
  console.log(`📦 Environment: ${env.VITE_APP_ENV || mode}`)

  return {
    plugins: [react()],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
    },
    optimizeDeps: {
      include: ['react', 'react-dom']
    },
    server: {
      host: env.VITE_DEV_SERVER_HOST || '127.0.0.1',
      port: parseInt(env.VITE_DEV_SERVER_PORT) || 3001,
      proxy: {
        '/apis': {
          target: 'https://marketinghub-test.rg-experience.com',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/apis/, 'apis'),
          configure: (proxy) => {
            proxy.on('error', (err) => {
              console.log('proxy error', err);
            });
            proxy.on('proxyReq', (proxyReq, req) => {
              console.log('Sending Request to the Target:', req.method, req.url);
            });
            proxy.on('proxyRes', (proxyRes, req) => {
              console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
            });
          },
        }
      }
    },
    build: {
      sourcemap: env.VITE_BUILD_SOURCEMAP === 'true',
      minify: env.VITE_BUILD_MINIFY !== 'false',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            ui: ['@mui/material', '@mui/icons-material'],
            redux: ['@reduxjs/toolkit', 'react-redux'],
            i18n: ['i18next', 'react-i18next']
          }
        }
      }
    },
    define: {
      // 将环境变量注入到客户端代码中
      __APP_ENV__: JSON.stringify(env.VITE_APP_ENV || mode),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString())
    }
  }
})