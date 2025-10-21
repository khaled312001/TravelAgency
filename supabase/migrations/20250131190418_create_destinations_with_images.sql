-- Drop existing destinations table if it exists
DROP TABLE IF EXISTS destinations CASCADE;

-- Create destinations table with correct structure
CREATE TABLE destinations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name_ar VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  description_ar TEXT,
  description_en TEXT,
  region_ar VARCHAR(255) NOT NULL,
  region_en VARCHAR(255) NOT NULL,
  location_type_ar VARCHAR(100) NOT NULL,
  location_type_en VARCHAR(100) NOT NULL,
  destination_type_ar VARCHAR(100) NOT NULL,
  destination_type_en VARCHAR(100) NOT NULL,
  main_image TEXT,
  featured BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_destinations_status ON destinations(status);
CREATE INDEX IF NOT EXISTS idx_destinations_featured ON destinations(featured);
CREATE INDEX IF NOT EXISTS idx_destinations_region_ar ON destinations(region_ar);
CREATE INDEX IF NOT EXISTS idx_destinations_destination_type_ar ON destinations(destination_type_ar);
CREATE INDEX IF NOT EXISTS idx_destinations_created_at ON destinations(created_at);

-- Enable RLS (Row Level Security)
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Public destinations are viewable by everyone" ON destinations
  FOR SELECT USING (true);

-- Create policy for authenticated users to insert
CREATE POLICY "Authenticated users can insert destinations" ON destinations
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create policy for authenticated users to update
CREATE POLICY "Authenticated users can update destinations" ON destinations
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policy for authenticated users to delete
CREATE POLICY "Authenticated users can delete destinations" ON destinations
  FOR DELETE USING (auth.role() = 'authenticated');

-- Insert all destinations with Cloudinary images
INSERT INTO destinations (name_ar, name_en, description_ar, description_en, region_ar, region_en, location_type_ar, location_type_en, destination_type_ar, destination_type_en, main_image, featured, status) VALUES
('الرياض', 'Riyadh', 'مدينة عصرية تنهض من الصحراء، تمزج بين التراث التاريخي والرؤية المستقبلية', 'A modern metropolis rising from the desert, blending historical heritage with futuristic vision', 'منطقة الرياض', 'Riyadh Region', 'مدينة', 'Urban', 'حضري', 'Metropolitan', 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067157/worldtripagency/destinations/riyadh-main.jpg', true, 'active'),
('جدة', 'Jeddah', 'مدينة ميناء تاريخية ذات تراث ثقافي غني وواجهة بحرية حديثة', 'Historic port city with a rich cultural heritage and modern waterfront', 'منطقة مكة المكرمة', 'Makkah Region', 'ساحلي', 'Coastal', 'ثقافي', 'Cultural', 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067159/worldtripagency/destinations/jeddah-main.jpg', true, 'active'),
('مكة المكرمة', 'Makkah', 'أقدس مدينة في الإسلام، موطن المسجد الحرام والمواقع الدينية القديمة', 'The holiest city in Islam, home to the Grand Mosque and ancient religious sites', 'منطقة مكة المكرمة', 'Makkah Region', 'ديني', 'Religious', 'روحاني', 'Spiritual', 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067161/worldtripagency/destinations/makkah-main.jpg', true, 'active'),
('المدينة المنورة', 'Medina', 'ثاني أقدس مدينة في الإسلام، معروفة بأجوائها الهادئة ومساجدها التاريخية', 'The second-holiest city in Islam, known for its peaceful atmosphere and historical mosques', 'منطقة المدينة المنورة', 'Medina Region', 'ديني', 'Religious', 'روحاني', 'Spiritual', 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067163/worldtripagency/destinations/medina-main.jpg', true, 'active'),
('العلا', 'Al Ula', 'واحة قديمة تضم الحجر، أول موقع للتراث العالمي في المملكة العربية السعودية', 'Ancient oasis city featuring Hegra, Saudi Arabia''s first UNESCO World Heritage site', 'منطقة المدينة المنورة', 'Medina Region', 'تاريخي', 'Historical', 'ثقافي', 'Cultural', 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067165/worldtripagency/destinations/alula-main.jpg', true, 'active'),
('البحر الأحمر', 'Red Sea', 'ساحل نقي بمياه صافية وشعاب مرجانية ومنتجعات فاخرة', 'Pristine coastline with crystal-clear waters, coral reefs, and luxury resorts', 'منطقة البحر الأحمر', 'Red Sea Region', 'ساحلي', 'Coastal', 'شاطئي', 'Beach', 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067184/worldtripagency/destinations/red-sea-main.jpg', true, 'active'),
('باريس', 'Paris', 'مدينة النور، مركز عالمي للفن والأزياء والطعام والثقافة', 'The City of Light, a global center for art, fashion, gastronomy, and culture', 'إيل دو فرانس', 'Île-de-France', 'مدينة', 'Urban', 'ثقافي', 'Cultural', 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067177/worldtripagency/destinations/paris-main.jpg', true, 'active'),
('لندن', 'London', 'مدينة متنوعة تمزج بين التاريخ والحداثة، معروفة بمعالمها الأيقونية', 'A diverse metropolis blending history and modernity, known for its iconic landmarks', 'لندن الكبرى', 'Greater London', 'مدينة', 'Urban', 'ثقافي', 'Cultural', 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067173/worldtripagency/destinations/london-main.jpg', true, 'active'),
('إسطنبول', 'Istanbul', 'حيث يلتقي الشرق بالغرب، مدينة تمتد على قارتين بتاريخ غني', 'Where East meets West, a city straddling two continents with rich history', 'مرمرة', 'Marmara', 'ساحلي', 'Coastal', 'تاريخي', 'Historical', 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067171/worldtripagency/destinations/istanbul-main.jpg', true, 'active'),
('القاهرة', 'Cairo', 'عاصمة مصر، مدينة يلتقي فيها التاريخ القديم بالحياة العصرية', 'The capital of Egypt, a city where ancient history meets modern life', 'محافظة القاهرة', 'Cairo Governorate', 'مدينة', 'Urban', 'تاريخي', 'Historical', 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067169/worldtripagency/destinations/cairo-main.jpg', true, 'active'),
('برشلونة', 'Barcelona', 'مدينة متوسطية نابضة بالحياة تشتهر بهندستها المعمارية المذهلة', 'A vibrant Mediterranean city known for its stunning architecture and rich culture', 'كتالونيا', 'Catalonia', 'ساحلي', 'Coastal', 'ثقافي', 'Cultural', 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067167/worldtripagency/destinations/barcelona-main.jpg', true, 'active'),
('مدريد', 'Madrid', 'عاصمة إسبانيا المركزية، مدينة الشوارع الأنيقة والحدائق الواسعة', 'Spain''s central capital, a city of elegant boulevards and expansive parks', 'مجتمع مدريد', 'Community of Madrid', 'مدينة', 'Urban', 'ثقافي', 'Cultural', 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067174/worldtripagency/destinations/madrid-main.jpg', false, 'active'),
('المغرب', 'Morocco', 'دولة في شمال أفريقيا تقدم مزيجاً من التأثيرات الثقافية', 'A North African country offering a blend of cultural influences', 'شمال أفريقيا', 'North Africa', 'متنوع', 'Diverse', 'ثقافي', 'Cultural', 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067176/worldtripagency/destinations/morocco-main.jpg', false, 'active'),
('شرم الشيخ', 'Sharm El Sheikh', 'جنة ساحلية معروفة بشواطئها النقية والشعاب المرجانية', 'A coastal paradise known for its pristine beaches and vibrant coral reefs', 'جنوب سيناء', 'South Sinai', 'ساحلي', 'Coastal', 'شاطئ', 'Beach', 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067179/worldtripagency/destinations/sharm-el-sheikh-main.jpg', false, 'active'),
('تايلاند', 'Thailand', 'دولة في جنوب شرق آسيا معروفة بشواطئها الاستوائية', 'Southeast Asian country known for tropical beaches and ornate temples', 'جنوب شرق آسيا', 'Southeast Asia', 'متنوع', 'Diverse', 'ثقافي', 'Cultural', 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067181/worldtripagency/destinations/thailand-main.jpg', true, 'active'),
('جورجيا', 'Georgia', 'دولة في مفترق طرق أوروبا الشرقية وغرب آسيا', 'A country at the intersection of Eastern Europe and Western Asia', 'القوقاز', 'Caucasus', 'متنوع', 'Diverse', 'ثقافي', 'Cultural', 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067183/worldtripagency/destinations/georgia-main.jpg', false, 'active');
