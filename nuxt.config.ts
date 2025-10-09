// https://nuxt.com/docs/api/configuration/nuxt-config
const productionURL = 'https://www.worldtripagency.com'
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

  icon: {
    serverBundle: 'auto',
    collections: ['lucide', 'heroicons', 'material-symbols']
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
      name: 'World Trip Agency Traveling Agency',
      short_name: 'World Trip Agency',
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
      publicSiteUrl: process.env.PUBLIC_SITE_URL || 'https://www.worldtripagency.com'
    }
  },

  image: {
    provider: 'ipx',
    dir: 'public',
    domains: ['images.unsplash.com', 'images.pexels.com', 'worldtripagency.com', 'www.worldtripagency.com'],
    format: ['webp', 'jpeg', 'png'],
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
      },
      hero: {
        modifiers: {
          format: 'webp',
          width: 1920,
          height: 1080,
          quality: 80
        }
      }
    },
    ipx: {
      maxAge: 60 * 60 * 24 * 7 // 7 days
    }
  },

  i18n: {
    baseUrl: process.env.NODE_ENV === 'production'
      ? 'https://www.worldtripagency.com'
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
    trailingSlash: false,
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
    // Handle image processing and domain redirects
    experimental: {
      wasm: true
    },
    routeRules: {
      '/images/**': { 
        headers: { 'cache-control': 's-maxage=31536000' }
      },
      '/videos/**': { 
        headers: { 'cache-control': 's-maxage=31536000' }
      },
      '/icons/**': { 
        headers: { 'cache-control': 's-maxage=31536000' }
      },
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
      '/_ipx/**': { 
        headers: { 
          'cache-control': 's-maxage=31536000',
          'access-control-allow-origin': '*',
          'access-control-allow-methods': 'GET, HEAD, OPTIONS',
          'content-type': 'image/webp'
        }
      },
      '/api/**': { 
        cors: true
      },
      '/admin/**': { ssr: false }
    }
  },

  ssr: true,

  experimental: {
    viewTransition: true
  },

  app: {
    head: {
      title: 'أرض العجائب للسفر - أفضل وكالة سفر في السعودية | رحلات عمرة وحج وسياحة',
      titleTemplate: '%s | أرض العجائب للسفر',
      htmlAttrs: {
        lang: 'ar-SA',
        dir: 'rtl'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'أفضل وكالة سفر في المملكة العربية السعودية. رحلات عمرة وحج، سياحة داخلية وخارجية، باقات سفر متميزة إلى دبي، تركيا، ماليزيا، تايلاند وأكثر. خدمة 24/7 وأسعار منافسة.'
        },
        {
          name: 'keywords',
          content: 'وكالة سفر السعودية, رحلات عمرة, رحلات حج, سياحة السعودية, رحلات دبي, رحلات تركيا, رحلات ماليزيا, رحلات تايلاند, باقات سفر, وكالة سفر الرياض, سفر وسياحة, رحلات خارجية, رحلات داخلية, أرض العجائب للسفر'
        },
        { name: 'author', content: 'أرض العجائب للسفر' },
        { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
        { name: 'googlebot', content: 'index, follow' },
        { name: 'bingbot', content: 'index, follow' },
        
        // Open Graph / Facebook
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://www.worldtripagency.com/' },
        { property: 'og:title', content: 'أرض العجائب للسفر - أفضل وكالة سفر في السعودية' },
        { property: 'og:description', content: 'أفضل وكالة سفر في المملكة العربية السعودية. رحلات عمرة وحج، سياحة داخلية وخارجية، باقات سفر متميزة.' },
        { property: 'og:image', content: 'https://www.worldtripagency.com/images/og-image.jpg' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:locale', content: 'ar_SA' },
        { property: 'og:site_name', content: 'أرض العجائب للسفر' },
        
        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:url', content: 'https://www.worldtripagency.com/' },
        { name: 'twitter:title', content: 'أرض العجائب للسفر - أفضل وكالة سفر في السعودية' },
        { name: 'twitter:description', content: 'أفضل وكالة سفر في المملكة العربية السعودية. رحلات عمرة وحج، سياحة داخلية وخارجية، باقات سفر متميزة.' },
        { name: 'twitter:image', content: 'https://www.worldtripagency.com/images/og-image.jpg' },
        
        // Additional SEO
        { name: 'theme-color', content: '#8b5cf6' },
        { name: 'msapplication-TileColor', content: '#8b5cf6' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: 'أرض العجائب للسفر' },
        
        // Geographic targeting
        { name: 'geo.region', content: 'SA' },
        { name: 'geo.placename', content: 'Riyadh, Saudi Arabia' },
        { name: 'geo.position', content: '24.7136;46.6753' },
        { name: 'ICBM', content: '24.7136, 46.6753' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;500;600;700;800;900&display=swap'
        },
        { rel: 'canonical', href: 'https://www.worldtripagency.com/' },
        { rel: 'alternate', hreflang: 'ar-SA', href: 'https://www.worldtripagency.com/' },
        { rel: 'alternate', hreflang: 'en-US', href: 'https://www.worldtripagency.com/en' },
        { rel: 'alternate', hreflang: 'x-default', href: 'https://www.worldtripagency.com/' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'manifest', href: '/site.webmanifest' }
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TravelAgency",
            "name": "أرض العجائب للسفر",
            "alternateName": "World Trip Agency Traveling Agency",
            "url": "https://www.worldtripagency.com",
            "logo": "https://www.worldtripagency.com/images/home/logo/WonderlandLogo.svg",
            "description": "أفضل وكالة سفر في المملكة العربية السعودية. رحلات عمرة وحج، سياحة داخلية وخارجية، باقات سفر متميزة.",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "الرياض",
              "addressLocality": "الرياض",
              "addressRegion": "منطقة الرياض",
              "addressCountry": "SA"
            },
            "telephone": "+966500982394",
            "email": "info@worldtripagency.com",
            "openingHours": "Mo-Su 00:00-23:59",
            "priceRange": "$$",
            "currenciesAccepted": "SAR",
            "paymentAccepted": "Cash, Credit Card",
            "areaServed": {
              "@type": "Country",
              "name": "Saudi Arabia"
            },
            "serviceType": [
              "رحلات عمرة",
              "رحلات حج", 
              "سياحة داخلية",
              "سياحة خارجية",
              "باقات سفر"
            ],
            "sameAs": [
              "https://www.instagram.com/wonderlandtravel",
              "https://www.facebook.com/wonderlandtravel",
              "https://wa.me/966500982394"
            ]
          })
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