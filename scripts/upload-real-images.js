import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dwpbixx3o',
  api_key: '457217934572426',
  api_secret: 'p75oOG1U8c_mMf-TAqrziSbGxBA',
  secure: true,
});

// Map of destination names to their image files
const destinationImages = {
  'riyadh': 'public/images/destinations/saudi/riyadh/Riyadh1.jpeg',
  'jeddah': 'public/images/destinations/saudi/jeddah/Jeddah1.jpeg',
  'makkah': 'public/images/destinations/saudi/Makkah/Makkah1.jpeg',
  'medina': 'public/images/destinations/saudi/Medina/Medina1.jpeg',
  'alula': 'public/images/destinations/saudi/alula/AlUla1.jpeg',
  'barcelona': 'public/images/destinations/global/Barcelona/Barcelona1.jpeg',
  'cairo': 'public/images/destinations/global/Cairo/Cairo1.jpeg',
  'istanbul': 'public/images/destinations/global/Istanbul/Istanbul1.jpeg',
  'london': 'public/images/destinations/global/London/London1.jpeg',
  'madrid': 'public/images/destinations/global/Madrid/Madrid1.jpeg',
  'morocco': 'public/images/destinations/global/Morocco/Morocco1.jpeg',
  'paris': 'public/images/destinations/global/Paris/Paris1.jpeg',
  'sharm-el-sheikh': 'public/images/destinations/global/SharmElSheikh/SharmElSheikh1.jpeg',
  'thailand': 'public/images/destinations/global/Thailand/Thailand1.jpeg',
  'georgia': 'public/images/destinations/global/Georgia/Georgia1.jpeg',
  'red-sea': 'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg'
};

async function uploadRealImages() {
  console.log('Starting to upload real destination images to Cloudinary...');
  
  const results = [];
  
  for (const [destinationName, imagePath] of Object.entries(destinationImages)) {
    try {
      console.log(`\n📸 Uploading ${destinationName}...`);
      
      let uploadResult;
      
      if (imagePath.startsWith('http')) {
        // Upload from URL
        console.log(`  📡 Uploading from URL: ${imagePath}`);
        uploadResult = await cloudinary.uploader.upload(imagePath, {
          folder: 'worldtripagency/destinations',
          resource_type: 'image',
          public_id: `${destinationName}-main`,
          tags: ['destination', destinationName, 'main']
        });
      } else {
        // Upload from local file
        const fullPath = path.resolve(imagePath);
        
        if (!fs.existsSync(fullPath)) {
          console.log(`  ❌ File not found: ${fullPath}`);
          results.push({
            destination: destinationName,
            success: false,
            error: 'File not found',
            path: imagePath
          });
          continue;
        }
        
        console.log(`  📁 Uploading from file: ${fullPath}`);
        uploadResult = await cloudinary.uploader.upload(fullPath, {
          folder: 'worldtripagency/destinations',
          resource_type: 'image',
          public_id: `${destinationName}-main`,
          tags: ['destination', destinationName, 'main']
        });
      }
      
      results.push({
        destination: destinationName,
        success: true,
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
        path: imagePath
      });
      
      console.log(`  ✅ Success: ${uploadResult.secure_url}`);
      
    } catch (error) {
      console.error(`  ❌ Failed to upload ${destinationName}:`, error.message);
      results.push({
        destination: destinationName,
        success: false,
        error: error.message,
        path: imagePath
      });
    }
  }
  
  console.log('\n📊 Upload Results Summary:');
  console.log('='.repeat(50));
  
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Successful uploads: ${successful.length}`);
  console.log(`❌ Failed uploads: ${failed.length}`);
  
  console.log('\n📋 Detailed Results:');
  console.log(JSON.stringify(results, null, 2));
  
  // Save results to file
  const resultsFile = 'real-images-upload-results.json';
  fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
  console.log(`\n💾 Results saved to ${resultsFile}`);
  
  // Create a mapping file for easy reference
  const mappingFile = 'destination-image-mapping.json';
  const mapping = {};
  results.forEach(result => {
    if (result.success) {
      mapping[result.destination] = result.url;
    }
  });
  fs.writeFileSync(mappingFile, JSON.stringify(mapping, null, 2));
  console.log(`🗺️  Image mapping saved to ${mappingFile}`);
  
  return results;
}

// Run the upload
uploadRealImages()
  .then(() => {
    console.log('\n🎉 Upload process completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Upload process failed:', error);
    process.exit(1);
  });
