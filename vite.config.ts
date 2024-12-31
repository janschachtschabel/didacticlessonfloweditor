import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  server: {
    fs: {
      strict: false
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
            return 'vendor-react';
          }
          
          if (id.includes('monaco-editor')) {
            return 'vendor-monaco';
          }
          
          if (id.includes('reactflow')) {
            return 'vendor-flow-core';
          }
          if (id.includes('dagre')) {
            return 'vendor-flow-dagre'; 
          }
          
          if (id.includes('jspdf')) {
            return 'vendor-pdf-core';
          }
          if (id.includes('html2canvas')) {
            return 'vendor-pdf-html2canvas';
          }
          if (id.includes('canvg')) {
            return 'vendor-pdf-canvg';
          }
          
          if (id.includes('axios')) {
            return 'vendor-api-axios';
          }
          if (id.includes('openai')) {
            return 'vendor-api-openai';
          }
          
          if (id.includes('zustand')) {
            return 'vendor-state-zustand';
          }
          if (id.includes('nanoid')) {
            return 'vendor-state-nanoid';
          }
          if (id.includes('clsx') || id.includes('tailwind-merge')) {
            return 'vendor-utils-styles';
          }
          if (id.includes('zod')) {
            return 'vendor-utils-zod';
          }
          
          if (id.includes('node_modules')) {
            if (id.includes('@heroicons') || id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('d3-')) {
              return 'vendor-d3';
            }
            if (id.includes('graphlib')) {
              return 'vendor-graph';
            }
            if (id.includes('core-js')) {
              return 'vendor-core';
            }
            if (id.includes('fflate')) {
              return 'vendor-compression';
            }
            if (id.includes('rgbcolor') || id.includes('stackblur')) {
              return 'vendor-canvas';
            }
            return id.split('node_modules/')[1].split('/')[0];
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }
});