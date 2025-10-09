// https://nuxt.com/docs/api/configuration/nuxt-config
const productionURL = 'https://worldtripagency.com'
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxt/image',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    'nuxt-schema-org',
    'nuxt-simple-sitemap',
    '@nuxtjs/i18n',
    'nuxt-aos',
    '@vite-pwa/nuxt',
    '@nuxt/icon',
    '@nuxtjs/supabase'
  ],

  // Icon module configuration
  icon: {
    serverBundle: 'local',
    clientBundle: 'local'
  },

  // Supabase module configuration
  supabase: {
    url: 'https://ueofktshvaqtxjsxvisv.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA',
    redirectOptions: {
      login: '/auth/login',
      callback: '/auth/confirm',
      exclude: ['/*']
    }
  },

  pwa: {
    registerType: 'autoUpdate',
    injectRegister: 'script',
    strategies:'generateSW',
    includeAssets: [
      'favicon.ico',
      'icons/**/*',
      'screenshots/**/*'
    ],
    manifest: {
      name: 'Wonder Land Traveling Agency',
      short_name: 'Wonder Land',
      description: 'Your trusted travel partner for unforgettable experiences, fulfilled for all travel needs',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'browser',
      orientation: 'portrait',
      scope: '/',
      start_url: '/',
      lang: 'ar-SA',
      dir: 'rtl',
      icons: [
        {
          src: '/icons/icon-36x36.png',
          sizes: '36x36',
          type: 'image/png'
        },
        {
          src: '/icons/icon-64x64.png',
          sizes: '64x64',
          type: 'image/png'
        },
        {
          src: '/icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        },
        {
          src: '/icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        }
      ],
      screenshots: [
        {
          src: '/screenshots/mobile-home.png',
          sizes: '320x640',
          type: 'image/png',
          platform: 'narrow',
          label: 'Home screen on mobile'
        },
        {
          src: '/screenshots/mobile-packages.png',
          sizes: '320x640',
          type: 'image/png',
          platform: 'narrow',
          label: 'Packages screen on mobile'
        },
        {
          src: '/screenshots/desktop-home.png',
          sizes: '1024x768',
          type: 'image/png',
          platform: 'wide',
          label: 'Home screen on desktop'
        },
        {
          src: '/screenshots/desktop-packages.png',
          sizes: '1024x768',
          type: 'image/png',
          platform: 'wide',
          label: 'Packages screen on desktop'
        }
      ]
    },
    workbox: {
      navigateFallback: null, // Disable global fallback
      cleanupOutdatedCaches: true,
      skipWaiting: true,
      clientsClaim: true,
      maximumFileSizeToCacheInBytes: 7 * 1024 * 1024, // 7 MB
      globPatterns: [
        '**/*.{js,css,html}',
        'images/**/*.{png,jpg,jpeg,svg,webp}',
        'icons/**/*.{ico,png,svg}'
      ],
      runtimeCaching: [
        {
          urlPattern: /\/api\/packages$/,
          handler: 'StaleWhileRevalidate',
          method: 'GET',
          options: {
            cacheName: 'api-packages-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 // 24 hours
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: ({ request }) => request.mode === 'navigate',
          handler: 'NetworkFirst',
          options: {
            cacheName: 'pages-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24 // 24 hours
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
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
        }
      ]
    },
    client: {
      installPrompt: true,
      registerPlugin: true,
      periodicSyncForUpdates: 3600 // Check for updates every hour (in seconds)
    }, 
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module'
    }
  },

  // AOS configuration
  aos: {
    offset: 15,
    duration: 600,
    easing: 'ease-out-quad',
    once: true,
    delay: 100,
    mirror: true
  },

  runtimeConfig: {
    // Twilio configuration for WhatsApp notifications
    twilioAccountSid: process.env.TWILIO_ACCOUNT_SID || '',
    twilioAuthToken: process.env.TWILIO_AUTH_TOKEN || '',
    twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER || '',
    salesManagerPhone: process.env.SALES_MANAGER_PHONE || '',
    
    public: {
      siteUrl: process.env.PUBLIC_SITE_URL || (process.env.NODE_ENV === 'production'
        ? productionURL
        : 'http://localhost:3000'),
      
      // Public site URL for links in notifications
      publicSiteUrl: process.env.PUBLIC_SITE_URL || 'https://worldtripagency.com'
    }
  },

  image: {
    provider: 'ipx',
    dir: 'public',
    domains: ['images.unsplash.com', 'images.pexels.com'],
    format: ['webp'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
    presets: {
      destination: {
        modifiers: {
          format: 'webp',
          width: 800,
          height: 600,
          quality: 90
        }
      }
    }
  },

  i18n: {
    baseUrl: process.env.NODE_ENV === 'production'
      ? 'https://worldtripagency.com'
      : 'http://localhost:3000',
    vueI18n: './i18n.config.ts',
    defaultLocale: 'ar-SA',
    locales: [
      {
        code: 'en-US',
        iso: 'en-US',
        name: 'English',
        dir: 'ltr'
      },
      {
        code: 'ar-SA',
        iso: 'ar-SA',
        name: 'العربية',
        dir: 'rtl'
      }
    ],
    strategy: 'prefix_except_default',
    detectBrowserLanguage: false,
    trailingSlash: true,
    differentDomains: false,
    lazy: true,
    customRoutes: 'config',
    pages: {
      // Define custom page routes for i18n
      'index': {
        en: '/',
        ar: '/'
      },
      'packages': {
        en: '/packages',
        ar: '/packages'
      },
      'about': {
        en: '/about',
        ar: '/about'
      }
    }
  },

  // Configure sitemap for multiple languages
  sitemap: {
    urls: async () => {
      // Your sitemap URLs generation logic here
      return []
    }
  },

  css: [
    '~/assets/css/transitions.css',
    '~/assets/css/form.css',
    '~/assets/css/direction.css',
    '~/assets/css/tooltip.css'
  ],

  plugins: [
    // AOS plugin removed as it's now handled by the nuxt-aos module
    '~/plugins/i18n.client.ts',
    '~/plugins/language-direction.ts',
    '~/plugins/initial-direction.server.ts',
    '~/plugins/pwa.client.ts',
    '~/plugins/packages-auto-refresh.client.ts'
  ],

  nitro: {
    preset: 'vercel',
    compressPublicAssets: {
      gzip: true,
      brotli: true
    },
    minify: true,
    // Improve static asset handling
    publicAssets: [
      {
        dir: 'public',
        maxAge: 60 * 60 * 24 * 365, // Cache for 1 year
        baseURL: '/'
      }
    ],
    routeRules: {
      '/images/**': { headers: { 'cache-control': 's-maxage=31536000' } },
      '/icons/**': { headers: { 'cache-control': 's-maxage=31536000' } },
      '/_nuxt/*.js': { 
        headers: { 
          'cache-control': 's-maxage=31536000',
          'content-type': 'application/javascript; charset=utf-8'
        } 
      },
      '/_nuxt/*.mjs': { 
        headers: { 
          'cache-control': 's-maxage=31536000',
          'content-type': 'application/javascript; charset=utf-8'
        } 
      },
      '/_nuxt/*.css': { 
        headers: { 
          'cache-control': 's-maxage=31536000',
          'content-type': 'text/css; charset=utf-8'
        } 
      },
      '/': { prerender: true },
      '/en-US': { prerender: true },
      '/en-US/': { prerender: true },
      '/packages/**': { prerender: true },
      '/destinations/**': { prerender: true },
      '/about': { prerender: true },
      '/admin/**': { ssr: false, index: false }
    },
    // Ensure proper static deployment
    experimental: {
      wasm: true
    }
  },

  ssr: true,

  experimental: {
    viewTransition: true
  },

  app: {
    head: {
      title: 'Wonder Land',
      htmlAttrs: {
        lang: 'ar-SA',
        dir: 'rtl'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Your trusted travel partner for unforgettable experiences'
        }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;500;600;700;800;900&display=swap'
        }
      ]
    },
    pageTransition: {
      name: 'page',
      mode: 'out-in'
    }
  },

  build: {
    transpile: [],
    analyze: false
  },

  vite: {
    build: {
      cssMinify: true,
      minify: 'terser',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue', 'vue-router'],
            admin: ['lucide-vue-next']
          }
        }
      }
    },
    css: {
      devSourcemap: false
    },
    optimizeDeps: {
      include: ['vue', 'vue-router'],
      exclude: ['@nuxt/icon']
    }
  },

  compatibilityDate: '2025-10-09'
})