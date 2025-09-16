import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'Nexus Válvulas e Conexões Industriais',
        short_name: 'Nexus Válvulas',
        description: 'Catálogo de válvulas e conexões industriais',
        theme_color: '#0066cc',
        icons: [
          {
            src: 'src/assets/logo.svg',
            sizes: '192x192',
            type: 'image/svg+xml'
          },
          {
            src: 'src/assets/logo.svg',
            sizes: '512x512',
            type: 'image/svg+xml'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});