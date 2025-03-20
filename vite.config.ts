import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import lucidePreprocess from "vite-plugin-lucide-preprocess";
// https://vitejs.dev/config/
export default defineConfig({
  
  plugins: [react(),lucidePreprocess()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
