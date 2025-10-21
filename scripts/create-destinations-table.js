import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA';
const supabase = createClient(supabaseUrl, supabaseKey);

// Sample destinations data with Cloudinary images
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
  }
];

async function createDestinationsTable() {
  console.log('Creating destinations with Cloudinary images...');
  
  try {
    // First, let's try to insert the destinations
    const { data, error } = await supabase
      .from('destinations')
      .insert(destinationsData)
      .select();
    
    if (error) {
      console.error('Error inserting destinations:', error);
      
      // If the table doesn't exist or has wrong structure, let's try to update existing ones
      console.log('Trying to update existing destinations...');
      
      for (const destination of destinationsData) {
        try {
          const { data: existing, error: fetchError } = await supabase
            .from('destinations')
            .select('*')
            .eq('name_ar', destination.name_ar)
            .single();
          
          if (existing) {
            console.log(`Found existing destination: ${destination.name_ar}`);
            // Try to update with the new structure
            const { error: updateError } = await supabase
              .from('destinations')
              .update({
                description_ar: destination.description_ar,
                description_en: destination.description_en,
                region_ar: destination.region_ar,
                region_en: destination.region_en,
                location_type_ar: destination.location_type_ar,
                location_type_en: destination.location_type_en,
                destination_type_ar: destination.destination_type_ar,
                destination_type_en: destination.destination_type_en,
                featured: destination.featured,
                status: destination.status,
                updated_at: new Date().toISOString()
              })
              .eq('name_ar', destination.name_ar);
            
            if (updateError) {
              console.error(`Error updating ${destination.name_ar}:`, updateError);
            } else {
              console.log(`✅ Updated ${destination.name_ar}`);
            }
          }
        } catch (err) {
          console.error(`Error processing ${destination.name_ar}:`, err);
        }
      }
    } else {
      console.log('✅ Successfully created destinations:', data.length);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the creation
createDestinationsTable()
  .then(() => {
    console.log('✅ Process completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Process failed:', error);
    process.exit(1);
  });
