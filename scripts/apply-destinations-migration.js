import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Supabase configuration
const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA';
const supabase = createClient(supabaseUrl, supabaseKey);

// All destinations with Cloudinary images
const destinationsData = [
  {
    name_ar: 'الرياض',
    name_en: 'Riyadh',
    description_ar: 'مدينة عصرية تنهض من الصحراء، تمزج بين التراث التاريخي والرؤية المستقبلية',
    description_en: 'A modern metropolis rising from the desert, blending historical heritage with futuristic vision',
    region_ar: 'منطقة الرياض',
    region_en: 'Riyadh Region',
    location_type_ar: 'مدينة',
    location_type_en: 'Urban',
    destination_type_ar: 'حضري',
    destination_type_en: 'Metropolitan',
    main_image: 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067157/worldtripagency/destinations/riyadh-main.jpg',
    featured: true,
    status: 'active'
  },
  {
    name_ar: 'جدة',
    name_en: 'Jeddah',
    description_ar: 'مدينة ميناء تاريخية ذات تراث ثقافي غني وواجهة بحرية حديثة',
    description_en: 'Historic port city with a rich cultural heritage and modern waterfront',
    region_ar: 'منطقة مكة المكرمة',
    region_en: 'Makkah Region',
    location_type_ar: 'ساحلي',
    location_type_en: 'Coastal',
    destination_type_ar: 'ثقافي',
    destination_type_en: 'Cultural',
    main_image: 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067159/worldtripagency/destinations/jeddah-main.jpg',
    featured: true,
    status: 'active'
  },
  {
    name_ar: 'مكة المكرمة',
    name_en: 'Makkah',
    description_ar: 'أقدس مدينة في الإسلام، موطن المسجد الحرام والمواقع الدينية القديمة',
    description_en: 'The holiest city in Islam, home to the Grand Mosque and ancient religious sites',
    region_ar: 'منطقة مكة المكرمة',
    region_en: 'Makkah Region',
    location_type_ar: 'ديني',
    location_type_en: 'Religious',
    destination_type_ar: 'روحاني',
    destination_type_en: 'Spiritual',
    main_image: 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067161/worldtripagency/destinations/makkah-main.jpg',
    featured: true,
    status: 'active'
  },
  {
    name_ar: 'المدينة المنورة',
    name_en: 'Medina',
    description_ar: 'ثاني أقدس مدينة في الإسلام، معروفة بأجوائها الهادئة ومساجدها التاريخية',
    description_en: 'The second-holiest city in Islam, known for its peaceful atmosphere and historical mosques',
    region_ar: 'منطقة المدينة المنورة',
    region_en: 'Medina Region',
    location_type_ar: 'ديني',
    location_type_en: 'Religious',
    destination_type_ar: 'روحاني',
    destination_type_en: 'Spiritual',
    main_image: 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067163/worldtripagency/destinations/medina-main.jpg',
    featured: true,
    status: 'active'
  },
  {
    name_ar: 'العلا',
    name_en: 'Al Ula',
    description_ar: 'واحة قديمة تضم الحجر، أول موقع للتراث العالمي في المملكة العربية السعودية',
    description_en: 'Ancient oasis city featuring Hegra, Saudi Arabia\'s first UNESCO World Heritage site',
    region_ar: 'منطقة المدينة المنورة',
    region_en: 'Medina Region',
    location_type_ar: 'تاريخي',
    location_type_en: 'Historical',
    destination_type_ar: 'ثقافي',
    destination_type_en: 'Cultural',
    main_image: 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067165/worldtripagency/destinations/alula-main.jpg',
    featured: true,
    status: 'active'
  },
  {
    name_ar: 'البحر الأحمر',
    name_en: 'Red Sea',
    description_ar: 'ساحل نقي بمياه صافية وشعاب مرجانية ومنتجعات فاخرة',
    description_en: 'Pristine coastline with crystal-clear waters, coral reefs, and luxury resorts',
    region_ar: 'منطقة البحر الأحمر',
    region_en: 'Red Sea Region',
    location_type_ar: 'ساحلي',
    location_type_en: 'Coastal',
    destination_type_ar: 'شاطئي',
    destination_type_en: 'Beach',
    main_image: 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067184/worldtripagency/destinations/red-sea-main.jpg',
    featured: true,
    status: 'active'
  },
  {
    name_ar: 'باريس',
    name_en: 'Paris',
    description_ar: 'مدينة النور، مركز عالمي للفن والأزياء والطعام والثقافة',
    description_en: 'The City of Light, a global center for art, fashion, gastronomy, and culture',
    region_ar: 'إيل دو فرانس',
    region_en: 'Île-de-France',
    location_type_ar: 'مدينة',
    location_type_en: 'Urban',
    destination_type_ar: 'ثقافي',
    destination_type_en: 'Cultural',
    main_image: 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067177/worldtripagency/destinations/paris-main.jpg',
    featured: true,
    status: 'active'
  },
  {
    name_ar: 'لندن',
    name_en: 'London',
    description_ar: 'مدينة متنوعة تمزج بين التاريخ والحداثة، معروفة بمعالمها الأيقونية',
    description_en: 'A diverse metropolis blending history and modernity, known for its iconic landmarks',
    region_ar: 'لندن الكبرى',
    region_en: 'Greater London',
    location_type_ar: 'مدينة',
    location_type_en: 'Urban',
    destination_type_ar: 'ثقافي',
    destination_type_en: 'Cultural',
    main_image: 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067173/worldtripagency/destinations/london-main.jpg',
    featured: true,
    status: 'active'
  },
  {
    name_ar: 'إسطنبول',
    name_en: 'Istanbul',
    description_ar: 'حيث يلتقي الشرق بالغرب، مدينة تمتد على قارتين بتاريخ غني',
    description_en: 'Where East meets West, a city straddling two continents with rich history',
    region_ar: 'مرمرة',
    region_en: 'Marmara',
    location_type_ar: 'ساحلي',
    location_type_en: 'Coastal',
    destination_type_ar: 'تاريخي',
    destination_type_en: 'Historical',
    main_image: 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067171/worldtripagency/destinations/istanbul-main.jpg',
    featured: true,
    status: 'active'
  },
  {
    name_ar: 'القاهرة',
    name_en: 'Cairo',
    description_ar: 'عاصمة مصر، مدينة يلتقي فيها التاريخ القديم بالحياة العصرية',
    description_en: 'The capital of Egypt, a city where ancient history meets modern life',
    region_ar: 'محافظة القاهرة',
    region_en: 'Cairo Governorate',
    location_type_ar: 'مدينة',
    location_type_en: 'Urban',
    destination_type_ar: 'تاريخي',
    destination_type_en: 'Historical',
    main_image: 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067169/worldtripagency/destinations/cairo-main.jpg',
    featured: true,
    status: 'active'
  },
  {
    name_ar: 'برشلونة',
    name_en: 'Barcelona',
    description_ar: 'مدينة متوسطية نابضة بالحياة تشتهر بهندستها المعمارية المذهلة',
    description_en: 'A vibrant Mediterranean city known for its stunning architecture and rich culture',
    region_ar: 'كتالونيا',
    region_en: 'Catalonia',
    location_type_ar: 'ساحلي',
    location_type_en: 'Coastal',
    destination_type_ar: 'ثقافي',
    destination_type_en: 'Cultural',
    main_image: 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067167/worldtripagency/destinations/barcelona-main.jpg',
    featured: true,
    status: 'active'
  },
  {
    name_ar: 'مدريد',
    name_en: 'Madrid',
    description_ar: 'عاصمة إسبانيا المركزية، مدينة الشوارع الأنيقة والحدائق الواسعة',
    description_en: 'Spain\'s central capital, a city of elegant boulevards and expansive parks',
    region_ar: 'مجتمع مدريد',
    region_en: 'Community of Madrid',
    location_type_ar: 'مدينة',
    location_type_en: 'Urban',
    destination_type_ar: 'ثقافي',
    destination_type_en: 'Cultural',
    main_image: 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067174/worldtripagency/destinations/madrid-main.jpg',
    featured: false,
    status: 'active'
  },
  {
    name_ar: 'المغرب',
    name_en: 'Morocco',
    description_ar: 'دولة في شمال أفريقيا تقدم مزيجاً من التأثيرات الثقافية',
    description_en: 'A North African country offering a blend of cultural influences',
    region_ar: 'شمال أفريقيا',
    region_en: 'North Africa',
    location_type_ar: 'متنوع',
    location_type_en: 'Diverse',
    destination_type_ar: 'ثقافي',
    destination_type_en: 'Cultural',
    main_image: 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067176/worldtripagency/destinations/morocco-main.jpg',
    featured: false,
    status: 'active'
  },
  {
    name_ar: 'شرم الشيخ',
    name_en: 'Sharm El Sheikh',
    description_ar: 'جنة ساحلية معروفة بشواطئها النقية والشعاب المرجانية',
    description_en: 'A coastal paradise known for its pristine beaches and vibrant coral reefs',
    region_ar: 'جنوب سيناء',
    region_en: 'South Sinai',
    location_type_ar: 'ساحلي',
    location_type_en: 'Coastal',
    destination_type_ar: 'شاطئ',
    destination_type_en: 'Beach',
    main_image: 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067179/worldtripagency/destinations/sharm-el-sheikh-main.jpg',
    featured: false,
    status: 'active'
  },
  {
    name_ar: 'تايلاند',
    name_en: 'Thailand',
    description_ar: 'دولة في جنوب شرق آسيا معروفة بشواطئها الاستوائية',
    description_en: 'Southeast Asian country known for tropical beaches and ornate temples',
    region_ar: 'جنوب شرق آسيا',
    region_en: 'Southeast Asia',
    location_type_ar: 'متنوع',
    location_type_en: 'Diverse',
    destination_type_ar: 'ثقافي',
    destination_type_en: 'Cultural',
    main_image: 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067181/worldtripagency/destinations/thailand-main.jpg',
    featured: true,
    status: 'active'
  },
  {
    name_ar: 'جورجيا',
    name_en: 'Georgia',
    description_ar: 'دولة في مفترق طرق أوروبا الشرقية وغرب آسيا',
    description_en: 'A country at the intersection of Eastern Europe and Western Asia',
    region_ar: 'القوقاز',
    region_en: 'Caucasus',
    location_type_ar: 'متنوع',
    location_type_en: 'Diverse',
    destination_type_ar: 'ثقافي',
    destination_type_en: 'Cultural',
    main_image: 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067183/worldtripagency/destinations/georgia-main.jpg',
    featured: false,
    status: 'active'
  }
];

async function createDestinationsWithImages() {
  console.log('Creating destinations table with all images...');
  
  try {
    // First, let's try to clear existing data and insert new data
    console.log('Clearing existing destinations...');
    
    // Delete all existing destinations
    const { error: deleteError } = await supabase
      .from('destinations')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // This will delete all records
    
    if (deleteError) {
      console.log('Note: Could not clear existing data:', deleteError.message);
    } else {
      console.log('✅ Cleared existing destinations');
    }
    
    // Insert all destinations
    console.log('Inserting all destinations with images...');
    const { data, error } = await supabase
      .from('destinations')
      .insert(destinationsData)
      .select();
    
    if (error) {
      console.error('Error inserting destinations:', error);
      
      // If bulk insert fails, try inserting one by one
      console.log('Trying to insert destinations one by one...');
      
      for (const destination of destinationsData) {
        try {
          const { data: singleData, error: singleError } = await supabase
            .from('destinations')
            .insert(destination)
            .select();
          
          if (singleError) {
            console.error(`Error inserting ${destination.name_ar}:`, singleError);
          } else {
            console.log(`✅ Inserted ${destination.name_ar}`);
          }
        } catch (err) {
          console.error(`Error inserting ${destination.name_ar}:`, err);
        }
      }
    } else {
      console.log(`✅ Successfully inserted ${data.length} destinations`);
    }
    
    // Verify the data
    console.log('Verifying inserted data...');
    const { data: verifyData, error: verifyError } = await supabase
      .from('destinations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (verifyError) {
      console.error('Error verifying data:', verifyError);
    } else {
      console.log(`✅ Verification: Found ${verifyData.length} destinations in database`);
      
      // Show destinations with images
      const withImages = verifyData.filter(d => d.main_image);
      console.log(`✅ Destinations with images: ${withImages.length}`);
      
      // Show featured destinations
      const featured = verifyData.filter(d => d.featured);
      console.log(`✅ Featured destinations: ${featured.length}`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the creation
createDestinationsWithImages()
  .then(() => {
    console.log('✅ Process completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Process failed:', error);
    process.exit(1);
  });
