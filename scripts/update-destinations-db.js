import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Supabase configuration
const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA';
const supabase = createClient(supabaseUrl, supabaseKey);

// Cloudinary URLs for destinations (actual URLs from upload)
const destinationImageUrls = {
  'riyadh': 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067157/worldtripagency/destinations/riyadh-main.jpg',
  'jeddah': 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067159/worldtripagency/destinations/jeddah-main.jpg',
  'makkah': 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067161/worldtripagency/destinations/makkah-main.jpg',
  'medina': 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067163/worldtripagency/destinations/medina-main.jpg',
  'alula': 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067165/worldtripagency/destinations/alula-main.jpg',
  'barcelona': 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067167/worldtripagency/destinations/barcelona-main.jpg',
  'cairo': 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067169/worldtripagency/destinations/cairo-main.jpg',
  'istanbul': 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067171/worldtripagency/destinations/istanbul-main.jpg',
  'london': 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067173/worldtripagency/destinations/london-main.jpg',
  'madrid': 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067174/worldtripagency/destinations/madrid-main.jpg',
  'morocco': 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067176/worldtripagency/destinations/morocco-main.jpg',
  'paris': 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067177/worldtripagency/destinations/paris-main.jpg',
  'sharm-el-sheikh': 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067179/worldtripagency/destinations/sharm-el-sheikh-main.jpg',
  'thailand': 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067181/worldtripagency/destinations/thailand-main.jpg',
  'georgia': 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067183/worldtripagency/destinations/georgia-main.jpg',
  'red-sea': 'https://res.cloudinary.com/dwpbixx3o/image/upload/v1761067184/worldtripagency/destinations/red-sea-main.jpg'
};

async function updateDestinationsDatabase() {
  console.log('Starting to update destinations database with Cloudinary images...');
  
  try {
    // First, let's get all existing destinations
    const { data: destinations, error: fetchError } = await supabase
      .from('destinations')
      .select('*');
    
    if (fetchError) {
      throw new Error(`Failed to fetch destinations: ${fetchError.message}`);
    }
    
    console.log(`Found ${destinations.length} destinations in database`);
    
    const results = [];
    
    for (const destination of destinations) {
      try {
        // Find matching image URL based on name_ar or name_en
        let imageUrl = null;
        
        // Try to match by Arabic name
        const arabicName = destination.name_ar.toLowerCase();
        for (const [key, url] of Object.entries(destinationImageUrls)) {
          if (arabicName.includes(key) || key.includes(arabicName)) {
            imageUrl = url;
            break;
          }
        }
        
        // Try to match by English name if no Arabic match
        if (!imageUrl) {
          const englishName = destination.name_en.toLowerCase();
          for (const [key, url] of Object.entries(destinationImageUrls)) {
            if (englishName.includes(key) || key.includes(englishName)) {
              imageUrl = url;
              break;
            }
          }
        }
        
        if (imageUrl) {
          // Update destination with new image URL
          const { data: updatedDestination, error: updateError } = await supabase
            .from('destinations')
            .update({ 
              main_image: imageUrl,
              updated_at: new Date().toISOString()
            })
            .eq('id', destination.id)
            .select()
            .single();
          
          if (updateError) {
            throw new Error(`Failed to update ${destination.name_ar}: ${updateError.message}`);
          }
          
          results.push({
            id: destination.id,
            name_ar: destination.name_ar,
            name_en: destination.name_en,
            success: true,
            image_url: imageUrl
          });
          
          console.log(`✅ Updated ${destination.name_ar} with image: ${imageUrl}`);
        } else {
          console.log(`⚠️  No image found for ${destination.name_ar}`);
          results.push({
            id: destination.id,
            name_ar: destination.name_ar,
            name_en: destination.name_en,
            success: false,
            reason: 'No matching image found'
          });
        }
        
      } catch (error) {
        console.error(`❌ Failed to update ${destination.name_ar}:`, error.message);
        results.push({
          id: destination.id,
          name_ar: destination.name_ar,
          name_en: destination.name_en,
          success: false,
          error: error.message
        });
      }
    }
    
    console.log('\n📊 Update Results Summary:');
    console.log('='.repeat(50));
    
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    console.log(`✅ Successful updates: ${successful.length}`);
    console.log(`❌ Failed updates: ${failed.length}`);
    
    console.log('\n📋 Detailed Results:');
    console.log(JSON.stringify(results, null, 2));
    
    // Save results to file
    const resultsFile = 'destination-db-update-results.json';
    fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
    console.log(`\n💾 Results saved to ${resultsFile}`);
    
    return results;
    
  } catch (error) {
    console.error('❌ Update process failed:', error);
    throw error;
  }
}

// Run the update
updateDestinationsDatabase()
  .then(() => {
    console.log('\n🎉 Database update process completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Database update process failed:', error);
    process.exit(1);
  });
