import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA';
const supabase = createClient(supabaseUrl, supabaseKey);

async function simpleUpdate() {
  console.log('Updating existing destinations with basic info...');
  
  try {
    // Get existing destinations
    const { data: destinations, error: fetchError } = await supabase
      .from('destinations')
      .select('*');
    
    if (fetchError) {
      console.error('Error fetching destinations:', fetchError);
      return;
    }
    
    console.log(`Found ${destinations.length} destinations`);
    
    // Update each destination with basic information
    const updates = [
      { name_ar: 'الرياض', name_en: 'Riyadh', description_ar: 'مدينة عصرية تنهض من الصحراء', description_en: 'A modern metropolis rising from the desert' },
      { name_ar: 'جدة', name_en: 'Jeddah', description_ar: 'مدينة ميناء تاريخية', description_en: 'Historic port city' },
      { name_ar: 'مكة المكرمة', name_en: 'Makkah', description_ar: 'أقدس مدينة في الإسلام', description_en: 'The holiest city in Islam' },
      { name_ar: 'المدينة المنورة', name_en: 'Medina', description_ar: 'ثاني أقدس مدينة في الإسلام', description_en: 'The second-holiest city in Islam' },
      { name_ar: 'العلا', name_en: 'Al Ula', description_ar: 'واحة قديمة تضم الحجر', description_en: 'Ancient oasis city featuring Hegra' },
      { name_ar: 'باريس', name_en: 'Paris', description_ar: 'مدينة النور', description_en: 'The City of Light' },
      { name_ar: 'لندن', name_en: 'London', description_ar: 'مدينة متنوعة تمزج بين التاريخ والحداثة', description_en: 'A diverse metropolis blending history and modernity' },
      { name_ar: 'إسطنبول', name_en: 'Istanbul', description_ar: 'حيث يلتقي الشرق بالغرب', description_en: 'Where East meets West' },
      { name_ar: 'القاهرة', name_en: 'Cairo', description_ar: 'عاصمة مصر', description_en: 'The capital of Egypt' },
      { name_ar: 'برشلونة', name_en: 'Barcelona', description_ar: 'مدينة متوسطية نابضة بالحياة', description_en: 'A vibrant Mediterranean city' }
    ];
    
    for (const update of updates) {
      try {
        const { error } = await supabase
          .from('destinations')
          .update({
            name_en: update.name_en,
            description_ar: update.description_ar,
            description_en: update.description_en,
            updated_at: new Date().toISOString()
          })
          .eq('name_ar', update.name_ar);
        
        if (error) {
          console.error(`Error updating ${update.name_ar}:`, error);
        } else {
          console.log(`✅ Updated ${update.name_ar}`);
        }
      } catch (err) {
        console.error(`Error updating ${update.name_ar}:`, err);
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the update
simpleUpdate()
  .then(() => {
    console.log('✅ Update completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Update failed:', error);
    process.exit(1);
  });
