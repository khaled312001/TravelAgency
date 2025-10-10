-- Create site_content table for managing homepage content
CREATE TABLE IF NOT EXISTS site_content (
  id SERIAL PRIMARY KEY,
  page VARCHAR(100) NOT NULL UNIQUE,
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_site_content_page ON site_content(page);

-- Insert default homepage content
INSERT INTO site_content (page, content) VALUES (
  'homepage',
  '{
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
      }
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
  }'::jsonb
) ON CONFLICT (page) DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_site_content_updated_at ON site_content;
CREATE TRIGGER update_site_content_updated_at
    BEFORE UPDATE ON site_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
