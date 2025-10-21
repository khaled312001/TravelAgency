import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA';
const supabase = createClient(supabaseUrl, supabaseKey);

// Destinations with all required fields
const destinationsData = [
  {
    name_ar: 'الرياض',
    name_en: 'Riyadh',
    description_ar: 'مدينة عصرية تنهض من الصحراء، تمزج بين التراث التاريخي والرؤية المستقبلية',
    description_en: 'A modern metropolis rising from the desert, blending historical heritage with futuristic vision',
    country: 'Saudi Arabia',
    city: 'Riyadh',
    image_url: 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067157/worldtripagency/destinations/riyadh-main.jpg',
    featured: true,
    status: 'active',
    type: 'domestic'
  },
  {
    name_ar: 'جدة',
    name_en: 'Jeddah',
    description_ar: 'مدينة ميناء تاريخية ذات تراث ثقافي غني وواجهة بحرية حديثة',
    description_en: 'Historic port city with a rich cultural heritage and modern waterfront',
    country: 'Saudi Arabia',
    city: 'Jeddah',
    image_url: 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067159/worldtripagency/destinations/jeddah-main.jpg',
    featured: true,
    status: 'active',
    type: 'domestic'
  },
  {
    name_ar: 'مكة المكرمة',
    name_en: 'Makkah',
    description_ar: 'أقدس مدينة في الإسلام، موطن المسجد الحرام والمواقع الدينية القديمة',
    description_en: 'The holiest city in Islam, home to the Grand Mosque and ancient religious sites',
    country: 'Saudi Arabia',
    city: 'Makkah',
    image_url: 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067161/worldtripagency/destinations/makkah-main.jpg',
    featured: true,
    status: 'active',
    type: 'domestic'
  },
  {
    name_ar: 'المدينة المنورة',
    name_en: 'Medina',
    description_ar: 'ثاني أقدس مدينة في الإسلام، معروفة بأجوائها الهادئة ومساجدها التاريخية',
    description_en: 'The second-holiest city in Islam, known for its peaceful atmosphere and historical mosques',
    country: 'Saudi Arabia',
    city: 'Medina',
    image_url: 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067163/worldtripagency/destinations/medina-main.jpg',
    featured: true,
    status: 'active',
    type: 'domestic'
  },
  {
    name_ar: 'العلا',
    name_en: 'Al Ula',
    description_ar: 'واحة قديمة تضم الحجر، أول موقع للتراث العالمي في المملكة العربية السعودية',
    description_en: 'Ancient oasis city featuring Hegra, Saudi Arabia\'s first UNESCO World Heritage site',
    country: 'Saudi Arabia',
    city: 'Al Ula',
    image_url: 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067165/worldtripagency/destinations/alula-main.jpg',
    featured: true,
    status: 'active',
    type: 'domestic'
  },
  {
    name_ar: 'البحر الأحمر',
    name_en: 'Red Sea',
    description_ar: 'ساحل نقي بمياه صافية وشعاب مرجانية ومنتجعات فاخرة',
    description_en: 'Pristine coastline with crystal-clear waters, coral reefs, and luxury resorts',
    country: 'Saudi Arabia',
    city: 'Red Sea Coast',
    image_url: 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067184/worldtripagency/destinations/red-sea-main.jpg',
    featured: true,
    status: 'active',
    type: 'domestic'
  },
  {
    name_ar: 'باريس',
    name_en: 'Paris',
    description_ar: 'مدينة النور، مركز عالمي للفن والأزياء والطعام والثقافة',
    description_en: 'The City of Light, a global center for art, fashion, gastronomy, and culture',
    country: 'France',
    city: 'Paris',
    image_url: 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067177/worldtripagency/destinations/paris-main.jpg',
    featured: true,
    status: 'active',
    type: 'international'
  },
  {
    name_ar: 'لندن',
    name_en: 'London',
    description_ar: 'مدينة متنوعة تمزج بين التاريخ والحداثة، معروفة بمعالمها الأيقونية',
    description_en: 'A diverse metropolis blending history and modernity, known for its iconic landmarks',
    country: 'United Kingdom',
    city: 'London',
    image_url: 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067173/worldtripagency/destinations/london-main.jpg',
    featured: true,
    status: 'active',
    type: 'international'
  },
  {
    name_ar: 'إسطنبول',
    name_en: 'Istanbul',
    description_ar: 'حيث يلتقي الشرق بالغرب، مدينة تمتد على قارتين بتاريخ غني',
    description_en: 'Where East meets West, a city straddling two continents with rich history',
    country: 'Turkey',
    city: 'Istanbul',
    image_url: 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067171/worldtripagency/destinations/istanbul-main.jpg',
    featured: true,
    status: 'active',
    type: 'international'
  },
  {
    name_ar: 'القاهرة',
    name_en: 'Cairo',
    description_ar: 'عاصمة مصر، مدينة يلتقي فيها التاريخ القديم بالحياة العصرية',
    description_en: 'The capital of Egypt, a city where ancient history meets modern life',
    country: 'Egypt',
    city: 'Cairo',
    image_url: 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067169/worldtripagency/destinations/cairo-main.jpg',
    featured: true,
    status: 'active',
    type: 'international'
  },
  {
    name_ar: 'برشلونة',
    name_en: 'Barcelona',
    description_ar: 'مدينة متوسطية نابضة بالحياة تشتهر بهندستها المعمارية المذهلة',
    description_en: 'A vibrant Mediterranean city known for its stunning architecture and rich culture',
    country: 'Spain',
    city: 'Barcelona',
    image_url: 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067167/worldtripagency/destinations/barcelona-main.jpg',
    featured: true,
    status: 'active',
    type: 'international'
  },
  {
    name_ar: 'مدريد',
    name_en: 'Madrid',
    description_ar: 'عاصمة إسبانيا المركزية، مدينة الشوارع الأنيقة والحدائق الواسعة',
    description_en: 'Spain\'s central capital, a city of elegant boulevards and expansive parks',
    country: 'Spain',
    city: 'Madrid',
    image_url: 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067174/worldtripagency/destinations/madrid-main.jpg',
    featured: false,
    status: 'active',
    type: 'international'
  },
  {
    name_ar: 'المغرب',
    name_en: 'Morocco',
    description_ar: 'دولة في شمال أفريقيا تقدم مزيجاً من التأثيرات الثقافية',
    description_en: 'A North African country offering a blend of cultural influences',
    country: 'Morocco',
    city: 'Multiple Cities',
    image_url: 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067176/worldtripagency/destinations/morocco-main.jpg',
    featured: false,
    status: 'active',
    type: 'international'
  },
  {
    name_ar: 'شرم الشيخ',
    name_en: 'Sharm El Sheikh',
    description_ar: 'جنة ساحلية معروفة بشواطئها النقية والشعاب المرجانية',
    description_en: 'A coastal paradise known for its pristine beaches and vibrant coral reefs',
    country: 'Egypt',
    city: 'Sharm El Sheikh',
    image_url: 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067179/worldtripagency/destinations/sharm-el-sheikh-main.jpg',
    featured: false,
    status: 'active',
    type: 'international'
  },
  {
    name_ar: 'تايلاند',
    name_en: 'Thailand',
    description_ar: 'دولة في جنوب شرق آسيا معروفة بشواطئها الاستوائية',
    description_en: 'Southeast Asian country known for tropical beaches and ornate temples',
    country: 'Thailand',
    city: 'Multiple Cities',
    image_url: 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067181/worldtripagency/destinations/thailand-main.jpg',
    featured: true,
    status: 'active',
    type: 'international'
  },
  {
    name_ar: 'جورجيا',
    name_en: 'Georgia',
    description_ar: 'دولة في مفترق طرق أوروبا الشرقية وغرب آسيا',
    description_en: 'A country at the intersection of Eastern Europe and Western Asia',
    country: 'Georgia',
    city: 'Multiple Cities',
    image_url: 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067183/worldtripagency/destinations/georgia-main.jpg',
    featured: false,
    status: 'active',
    type: 'international'
  }
];

async function insertFinalDestinations() {
  console.log('Inserting destinations with all required fields...');
  
  try {
    // First, clear existing data
    console.log('Clearing existing destinations...');
    const { error: deleteError } = await supabase
      .from('destinations')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (deleteError) {
      console.log('Note: Could not clear existing data:', deleteError.message);
    } else {
      console.log('✅ Cleared existing destinations');
    }
    
    // Insert destinations one by one
    console.log('Inserting destinations...');
    let successCount = 0;
    
    for (const destination of destinationsData) {
      try {
        const { data, error } = await supabase
          .from('destinations')
          .insert(destination)
          .select();
        
        if (error) {
          console.error(`❌ Error inserting ${destination.name_ar}:`, error.message);
        } else {
          console.log(`✅ Inserted ${destination.name_ar}`);
          successCount++;
        }
      } catch (err) {
        console.error(`❌ Error inserting ${destination.name_ar}:`, err.message);
      }
    }
    
    console.log(`\n📊 Insertion Results:`);
    console.log(`✅ Successfully inserted: ${successCount}`);
    console.log(`❌ Failed: ${destinationsData.length - successCount}`);
    
    // Verify the data
    console.log('\n🔍 Verifying data...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('destinations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (verifyError) {
      console.error('Error verifying data:', verifyError);
    } else {
      console.log(`✅ Total destinations in database: ${verifyData.length}`);
      
      const withImages = verifyData.filter(d => d.image_url);
      console.log(`✅ Destinations with images: ${withImages.length}`);
      
      const featured = verifyData.filter(d => d.featured);
      console.log(`✅ Featured destinations: ${featured.length}`);
      
      // Show first few destinations
      console.log('\n📋 Sample destinations:');
      verifyData.slice(0, 5).forEach(dest => {
        console.log(`- ${dest.name_ar} (${dest.name_en}) - Image: ${dest.image_url ? 'Yes' : 'No'}`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the insertion
insertFinalDestinations()
  .then(() => {
    console.log('\n🎉 Process completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Process failed:', error);
    process.exit(1);
  });
