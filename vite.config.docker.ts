import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { VitePWA } from 'vite-plugin-pwa';

// Configuração do Vite otimizada para Docker
export default defineConfig(({ mode }) => {
  // Carregar variáveis de ambiente
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: {
          enabled: mode !== 'production'
        },
        manifest: {
          name: 'Nexus Válvulas e Conexões Industriais',
          short_name: 'Nexus Válvulas',
          description: 'Catálogo de válvulas e conexões industriais',
          theme_color: '#0066cc',
          background_color: '#ffffff',
          display: 'standalone',
          scope: '/',
          start_url: '/',
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
                  maxAgeSeconds: 60 * 60 * 24 * 365 // 365 days
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
                  maxAgeSeconds: 60 * 60 * 24 * 365 // 365 days
                },
                cacheableResponse: {
                  statuses: [0, 200]
                }
              }
            },
            // Cache para API calls
            {
              urlPattern: /^http:\/\/localhost\/api\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 5 // 5 minutes
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
    // Configurações específicas para Docker
    server: {
      host: '0.0.0.0', // Importante para Docker
      port: 3000,
      strictPort: true,
      watch: {
        usePolling: true // Necessário para Docker no Windows
      }
    },
    preview: {
      host: '0.0.0.0',
      port: 3000,
      strictPort: true
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
      chunkSizeWarningLimit: 1000,
      minify: mode === 'production' ? 'esbuild' : false,
      cssMinify: mode === 'production'
    },
    // Configurações de ambiente
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString())
    }
  };
});
