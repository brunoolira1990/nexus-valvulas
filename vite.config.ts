import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carregar variáveis de ambiente
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        // Desabilitar PWA completamente em desenvolvimento
        devOptions: {
          enabled: false,
          type: 'module',
        },
        manifest: {
          name: 'Nexus Válvulas e Conexões Industriais',
          short_name: 'Nexus Válvulas',
          description: 'Catálogo de válvulas e conexões industriais',
          theme_color: '#0066cc',
          icons: [
            {
              src: '/imagens/logo-nexus.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: '/imagens/logo-nexus.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        },
        workbox: {
          // Configurações para cache em produção
          globPatterns: ['**/*.{js,css,html,svg,png,jpg,jpeg,gif,webp,woff,woff2,ttf,eot,ico}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            {
              urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'gstatic-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
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
    // Otimizações para produção
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: mode === 'development',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tooltip'],
            utils: ['aos', 'lucide-react']
          }
        }
      },
      chunkSizeWarningLimit: 1000, // Aumentar limite para chunks maiores
      minify: mode === 'production' ? 'esbuild' : false,
      cssMinify: mode === 'production'
    },
    // Configurações específicas para desenvolvimento
    server: {
      port: 3000,
      strictPort: false,
      host: true
    },
    // Configurações para preview em produção
    preview: {
      port: 3000,
      host: true,
      strictPort: false
    }
  };
});