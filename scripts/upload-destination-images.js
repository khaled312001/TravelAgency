const { v2: cloudinary } = require('cloudinary');
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dwpbixx3o',
  api_key: '457217934572426',
  api_secret: 'p75oOG1U8c_mMf-TAqrziSbGxBA',
  secure: true,
});

// Destination images mapping
const destinationImages = {
  'riyadh': '/images/destinations/saudi/riyadh/Riyadh1.jpeg',
  'jeddah': '/images/destinations/saudi/jeddah/Jeddah1.jpeg',
  'makkah': '/images/destinations/saudi/Makkah/Makkah1.jpeg',
  'medina': '/images/destinations/saudi/Medina/Medina1.jpeg',
  'alula': '/images/destinations/saudi/alula/AlUla1.jpeg',
  'barcelona': '/images/destinations/global/Barcelona/Barcelona1.jpeg',
  'cairo': '/images/destinations/global/Cairo/Cairo1.jpeg',
  'istanbul': '/images/destinations/global/Istanbul/Istanbul1.jpeg',
  'london': '/images/destinations/global/London/London1.jpeg',
  'madrid': '/images/destinations/global/Madrid/Madrid1.jpeg',
  'morocco': '/images/destinations/global/Morocco/Morocco1.jpeg',
  'paris': '/images/destinations/global/Paris/Paris1.jpeg',
  'sharm-el-sheikh': '/images/destinations/global/SharmElSheikh/SharmElSheikh1.jpeg',
  'thailand': '/images/destinations/global/Thailand/Thailand1.jpeg',
  'georgia': '/images/destinations/global/Georgia/Georgia1.jpeg',
  'red-sea': 'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg'
};

async function uploadDestinationImages() {
  console.log('Starting to upload destination images to Cloudinary...');
  
  const results = {};
  
  for (const [destinationId, imagePath] of Object.entries(destinationImages)) {
    try {
      console.log(`Uploading image for ${destinationId}: ${imagePath}`);
      
      let uploadResult;
      
      if (imagePath.startsWith('http')) {
        // Upload from URL
        uploadResult = await cloudinary.uploader.upload(imagePath, {
          folder: 'worldtripagency/destinations',
          resource_type: 'image',
          public_id: `${destinationId}-main`
        });
      } else {
        // Upload from local file
        const fullPath = path.join(process.cwd(), 'public', imagePath);
        
        if (fs.existsSync(fullPath)) {
          uploadResult = await cloudinary.uploader.upload(fullPath, {
            folder: 'worldtripagency/destinations',
            resource_type: 'image',
            public_id: `${destinationId}-main`
          });
        } else {
          console.log(`File not found: ${fullPath}`);
          continue;
        }
      }
      
      results[destinationId] = {
        success: true,
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id
      };
      
      console.log(`✅ Uploaded ${destinationId}: ${uploadResult.secure_url}`);
      
    } catch (error) {
      console.error(`❌ Failed to upload ${destinationId}:`, error.message);
      results[destinationId] = {
        success: false,
        error: error.message
      };
    }
  }
  
  console.log('\n📊 Upload Results:');
  console.log(JSON.stringify(results, null, 2));
  
  // Save results to file
  fs.writeFileSync('destination-upload-results.json', JSON.stringify(results, null, 2));
  console.log('\n💾 Results saved to destination-upload-results.json');
  
  return results;
}

// Run the upload
uploadDestinationImages()
  .then(() => {
    console.log('✅ Upload process completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Upload process failed:', error);
    process.exit(1);
  });
