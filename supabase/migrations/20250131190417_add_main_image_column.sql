-- Add main_image column to destinations table
ALTER TABLE destinations ADD COLUMN IF NOT EXISTS main_image TEXT;

-- Update existing destinations with Cloudinary image URLs
UPDATE destinations SET main_image = 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067157/worldtripagency/destinations/riyadh-main.jpg' WHERE name_ar = 'الرياض';
UPDATE destinations SET main_image = 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067159/worldtripagency/destinations/jeddah-main.jpg' WHERE name_ar = 'جدة';
UPDATE destinations SET main_image = 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067161/worldtripagency/destinations/makkah-main.jpg' WHERE name_ar = 'مكة المكرمة';
UPDATE destinations SET main_image = 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067163/worldtripagency/destinations/medina-main.jpg' WHERE name_ar = 'المدينة المنورة';
UPDATE destinations SET main_image = 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067165/worldtripagency/destinations/alula-main.jpg' WHERE name_ar = 'العلا';
UPDATE destinations SET main_image = 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067167/worldtripagency/destinations/barcelona-main.jpg' WHERE name_ar = 'برشلونة';
UPDATE destinations SET main_image = 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067169/worldtripagency/destinations/cairo-main.jpg' WHERE name_ar = 'القاهرة';
UPDATE destinations SET main_image = 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067171/worldtripagency/destinations/istanbul-main.jpg' WHERE name_ar = 'إسطنبول';
UPDATE destinations SET main_image = 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067173/worldtripagency/destinations/london-main.jpg' WHERE name_ar = 'لندن';
UPDATE destinations SET main_image = 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067174/worldtripagency/destinations/madrid-main.jpg' WHERE name_ar = 'مدريد';
UPDATE destinations SET main_image = 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067176/worldtripagency/destinations/morocco-main.jpg' WHERE name_ar = 'المغرب';
UPDATE destinations SET main_image = 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067177/worldtripagency/destinations/paris-main.jpg' WHERE name_ar = 'باريس';
UPDATE destinations SET main_image = 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067179/worldtripagency/destinations/sharm-el-sheikh-main.jpg' WHERE name_ar = 'شرم الشيخ';
UPDATE destinations SET main_image = 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067181/worldtripagency/destinations/thailand-main.jpg' WHERE name_ar = 'تايلاند';
UPDATE destinations SET main_image = 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067183/worldtripagency/destinations/georgia-main.jpg' WHERE name_ar = 'جورجيا';
UPDATE destinations SET main_image = 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067184/worldtripagency/destinations/red-sea-main.jpg' WHERE name_ar = 'البحر الأحمر';
