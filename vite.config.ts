import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/wlo': {
        target: 'https://redaktion.openeduhub.net/edu-sharing/rest',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api\/wlo/, ''),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Ensure the correct path format for search requests
            const searchPath = '/search/v1/custom/-home-';
            proxyReq.path = `${searchPath}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;
            console.log('Sending Request:', proxyReq.path);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response:', proxyRes.statusCode);
          });
        },
      }
    }
  }
});