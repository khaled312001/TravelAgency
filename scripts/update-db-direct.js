import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA';
const supabase = createClient(supabaseUrl, supabaseKey);

// First, let's add the main_image column
async function addMainImageColumn() {
  console.log('Adding main_image column to destinations table...');
  
  try {
    // This will be done via SQL migration, but let's try to update existing records
    const { data: destinations, error: fetchError } = await supabase
      .from('destinations')
      .select('*');
    
    if (fetchError) {
      console.error('Error fetching destinations:', fetchError);
      return;
    }
    
    console.log(`Found ${destinations.length} destinations`);
    
    // Update each destination with its image
    const updates = [
      { name_ar: 'الرياض', image: 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067157/worldtripagency/destinations/riyadh-main.jpg' },
      { name_ar: 'جدة', image: 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067159/worldtripagency/destinations/jeddah-main.jpg' },
      { name_ar: 'مكة المكرمة', image: 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067161/worldtripagency/destinations/makkah-main.jpg' },
      { name_ar: 'المدينة المنورة', image: 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067163/worldtripagency/destinations/medina-main.jpg' },
      { name_ar: 'العلا', image: 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067165/worldtripagency/destinations/alula-main.jpg' },
      { name_ar: 'برشلونة', image: 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067167/worldtripagency/destinations/barcelona-main.jpg' },
      { name_ar: 'القاهرة', image: 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067169/worldtripagency/destinations/cairo-main.jpg' },
      { name_ar: 'إسطنبول', image: 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067171/worldtripagency/destinations/istanbul-main.jpg' },
      { name_ar: 'لندن', image: 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067173/worldtripagency/destinations/london-main.jpg' },
      { name_ar: 'مدريد', image: 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067174/worldtripagency/destinations/madrid-main.jpg' },
      { name_ar: 'المغرب', image: 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067176/worldtripagency/destinations/morocco-main.jpg' },
      { name_ar: 'باريس', image: 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067177/worldtripagency/destinations/paris-main.jpg' },
      { name_ar: 'شرم الشيخ', image: 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067179/worldtripagency/destinations/sharm-el-sheikh-main.jpg' },
      { name_ar: 'تايلاند', image: 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067181/worldtripagency/destinations/thailand-main.jpg' },
      { name_ar: 'جورجيا', image: 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067183/worldtripagency/destinations/georgia-main.jpg' },
      { name_ar: 'البحر الأحمر', image: 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067184/worldtripagency/destinations/red-sea-main.jpg' }
    ];
    
    for (const update of updates) {
      try {
        const { data, error } = await supabase
          .from('destinations')
          .update({ 
            main_image: update.image,
            updated_at: new Date().toISOString()
          })
          .eq('name_ar', update.name_ar)
          .select();
        
        if (error) {
          console.error(`Error updating ${update.name_ar}:`, error);
        } else {
          console.log(`✅ Updated ${update.name_ar} with image`);
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
addMainImageColumn()
  .then(() => {
    console.log('✅ Update process completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Update process failed:', error);
    process.exit(1);
  });
