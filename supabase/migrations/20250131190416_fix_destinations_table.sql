-- Fix destinations table structure
-- First, let's check if the table exists and what columns it has
-- If the table doesn't exist, create it with the correct structure
-- If it exists but has wrong columns, we'll need to alter it

-- Drop existing table if it exists (be careful in production!)
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

-- Insert sample data with proper structure
INSERT INTO destinations (name_ar, name_en, description_ar, description_en, region_ar, region_en, location_type_ar, location_type_en, destination_type_ar, destination_type_en, main_image, featured, status) VALUES
('الرياض', 'Riyadh', 'مدينة عصرية تنهض من الصحراء، تمزج بين التراث التاريخي والرؤية المستقبلية', 'A modern metropolis rising from the desert, blending historical heritage with futuristic vision', 'منطقة الرياض', 'Riyadh Region', 'مدينة', 'Urban', 'حضري', 'Metropolitan', '', true, 'active'),
('جدة', 'Jeddah', 'مدينة ميناء تاريخية ذات تراث ثقافي غني وواجهة بحرية حديثة', 'Historic port city with a rich cultural heritage and modern waterfront', 'منطقة مكة المكرمة', 'Makkah Region', 'ساحلي', 'Coastal', 'ثقافي', 'Cultural', '', true, 'active'),
('مكة المكرمة', 'Makkah', 'أقدس مدينة في الإسلام، موطن المسجد الحرام والمواقع الدينية القديمة', 'The holiest city in Islam, home to the Grand Mosque and ancient religious sites', 'منطقة مكة المكرمة', 'Makkah Region', 'ديني', 'Religious', 'روحاني', 'Spiritual', '', true, 'active'),
('المدينة المنورة', 'Medina', 'ثاني أقدس مدينة في الإسلام، معروفة بأجوائها الهادئة ومساجدها التاريخية', 'The second-holiest city in Islam, known for its peaceful atmosphere and historical mosques', 'منطقة المدينة المنورة', 'Medina Region', 'ديني', 'Religious', 'روحاني', 'Spiritual', '', true, 'active'),
('العلا', 'Al Ula', 'واحة قديمة تضم الحجر، أول موقع للتراث العالمي في المملكة العربية السعودية', 'Ancient oasis city featuring Hegra, Saudi Arabia''s first UNESCO World Heritage site', 'منطقة المدينة المنورة', 'Medina Region', 'تاريخي', 'Historical', 'ثقافي', 'Cultural', '', true, 'active'),
('باريس', 'Paris', 'مدينة النور، مركز عالمي للفن والأزياء والطعام والثقافة', 'The City of Light, a global center for art, fashion, gastronomy, and culture', 'إيل دو فرانس', 'Île-de-France', 'مدينة', 'Urban', 'ثقافي', 'Cultural', '', true, 'active'),
('لندن', 'London', 'مدينة متنوعة تمزج بين التاريخ والحداثة، معروفة بمعالمها الأيقونية', 'A diverse metropolis blending history and modernity, known for its iconic landmarks', 'لندن الكبرى', 'Greater London', 'مدينة', 'Urban', 'ثقافي', 'Cultural', '', true, 'active'),
('إسطنبول', 'Istanbul', 'حيث يلتقي الشرق بالغرب، مدينة تمتد على قارتين بتاريخ غني', 'Where East meets West, a city straddling two continents with rich history', 'مرمرة', 'Marmara', 'ساحلي', 'Coastal', 'تاريخي', 'Historical', '', true, 'active'),
('القاهرة', 'Cairo', 'عاصمة مصر، مدينة يلتقي فيها التاريخ القديم بالحياة العصرية', 'The capital of Egypt, a city where ancient history meets modern life', 'محافظة القاهرة', 'Cairo Governorate', 'مدينة', 'Urban', 'تاريخي', 'Historical', '', true, 'active'),
('برشلونة', 'Barcelona', 'مدينة متوسطية نابضة بالحياة تشتهر بهندستها المعمارية المذهلة', 'A vibrant Mediterranean city known for its stunning architecture and rich culture', 'كتالونيا', 'Catalonia', 'ساحلي', 'Coastal', 'ثقافي', 'Cultural', '', true, 'active');
