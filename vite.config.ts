import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import lucidePreprocess from "vite-plugin-lucide-preprocess";
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    https: {
    key: "/home/zenith/aboutme/zenithpage2/cert/nekos.work.key",
    cert: "/home/zenith/aboutme/zenithpage2/cert/nekos.work.cer",
    },
    },
  plugins: [react(),lucidePreprocess()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});