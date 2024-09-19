import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/ComposeSDKdemo/', // Ensure this matches your GitHub Pages repository name
  resolve: {
    alias: {
      '@': '/src', // This allows you to use '@' as an alias for your src directory
    },
  },
  build: {
    outDir: 'dist', // Output directory for build files
    rollupOptions: {
      // Optional: Manual chunks for better optimization
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
      },
    },
  },
});
