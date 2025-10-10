-- تحديث محتوى قاعدة البيانات لإضافة حقول الفيديو والصور
UPDATE site_content 
SET content = '{
  "hero": {
    "title": {
      "ar": "نحنُ نأخذك إلى أفضل الأماكن حول العالم",
      "en": "We take you to the best places around the world"
    },
    "subtitle": {
      "ar": "باقات سفر شاملة تناسب جميع الميزانيات. وجهتك المثالية تبدأ معنا!",
      "en": "All-inclusive travel packages to suit every budget. Your perfect destination starts with us!"
    },
    "cta": {
      "ar": "استكشف باقاتنا",
      "en": "Explore Our Packages"
    },
    "video_desktop": "/videos/hero/desktop/hero-desktop.webm",
    "video_mobile": "/videos/hero/mobile/hero-mobile-center.webm",
    "poster_image": "/images/home/heroSection/hero-image.webp"
  },
  "search": {
    "title": {
      "ar": "ابحث عن رحلتك المثالية",
      "en": "Find Your Perfect Package"
    },
    "description": {
      "ar": "اكتشف باقات سفر مذهلة مصممة حسب تفضيلاتك",
      "en": "Discover amazing travel packages tailored to your preferences"
    }
  },
  "services": {
    "title": {
      "ar": "خدماتنا المميزة",
      "en": "Our Premium Services"
    },
    "subtitle": {
      "ar": "استمتع بتجربة سفر سلسة مع مجموعة خدماتنا المميزة المصممة لجعل رحلتك استثنائية",
      "en": "Experience seamless travel with our comprehensive range of premium services designed to make your journey extraordinary"
    },
    "description": {
      "ar": "رحلة أحلامك هي شغفنا. نبذل قصارى جهدنا لتصميم تجارب سفر لا تُنسى، ونهتم بكل التفاصيل حتى تتمكن من التركيز على صنع ذكريات جميلة.",
      "en": "Your dream journey is our passion. We go above and beyond to craft unforgettable travel experiences, taking care of every detail so you can focus on creating beautiful memories."
    }
  },
  "destinations": {
    "saudi": {
      "title": {
        "ar": "اكتشف روعة المملكة",
        "en": "Discover Saudi Arabia"
      },
      "subtitle": {
        "ar": "رحلة استثنائية عبر التراث العريق والحضارة المعاصرة والطبيعة الخلابة",
        "en": "Embark on an extraordinary journey through ancient traditions, modern marvels, and breathtaking landscapes"
      }
    },
    "global": {
      "title": {
        "ar": "وجهات عالمية فاخرة",
        "en": "World-Class Destinations"
      },
      "subtitle": {
        "ar": "عش تجارب لا تُنسى في أروع الوجهات حول العالم",
        "en": "Experience unforgettable adventures in the most spectacular places around the globe"
      }
    }
  }
}'::jsonb,
updated_at = NOW()
WHERE page = 'homepage';
