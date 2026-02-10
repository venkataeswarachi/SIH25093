import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Use a more specific match or a bypass
      '/student': {
        target: 'http://127.0.0.1:2008',
        changeOrigin: true,
        // This line ensures that if the browser is asking for an HTML page, 
        // it doesn't proxy to the backend
        bypass: (req) => {
          if (req.headers.accept.indexOf('html') !== -1) {
            return '/index.html';
          }
        },
      },
      '/auth': 'http://127.0.0.1:2008',
      '/faculty': 'http://127.0.0.1:2008',
      '/admin': 'http://127.0.0.1:2008',
    }
  }
})