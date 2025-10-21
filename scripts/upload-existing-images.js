const { v2: cloudinary } = require('cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dwpbixx3o',
  api_key: '457217934572426',
  api_secret: 'p75oOG1U8c_mMf-TAqrziSbGxBA',
  secure: true,
});

// List of existing destination images to upload
const imagesToUpload = [
  {
    name: 'riyadh',
    url: 'https://images.pexels.com/photos/1234567/pexels-photo-1234567.jpeg', // Placeholder
    description: 'Riyadh city skyline'
  },
  {
    name: 'jeddah',
    url: 'https://images.pexels.com/photos/1234568/pexels-photo-1234568.jpeg', // Placeholder
    description: 'Jeddah waterfront'
  },
  {
    name: 'makkah',
    url: 'https://images.pexels.com/photos/1234569/pexels-photo-1234569.jpeg', // Placeholder
    description: 'Makkah Grand Mosque'
  },
  {
    name: 'medina',
    url: 'https://images.pexels.com/photos/1234570/pexels-photo-1234570.jpeg', // Placeholder
    description: 'Medina Prophet Mosque'
  },
  {
    name: 'alula',
    url: 'https://images.pexels.com/photos/1234571/pexels-photo-1234571.jpeg', // Placeholder
    description: 'Al Ula rock formations'
  },
  {
    name: 'paris',
    url: 'https://images.pexels.com/photos/1234572/pexels-photo-1234572.jpeg', // Placeholder
    description: 'Paris Eiffel Tower'
  },
  {
    name: 'london',
    url: 'https://images.pexels.com/photos/1234573/pexels-photo-1234573.jpeg', // Placeholder
    description: 'London Big Ben'
  },
  {
    name: 'istanbul',
    url: 'https://images.pexels.com/photos/1234574/pexels-photo-1234574.jpeg', // Placeholder
    description: 'Istanbul Hagia Sophia'
  },
  {
    name: 'cairo',
    url: 'https://images.pexels.com/photos/1234575/pexels-photo-1234575.jpeg', // Placeholder
    description: 'Cairo Pyramids'
  },
  {
    name: 'barcelona',
    url: 'https://images.pexels.com/photos/1234576/pexels-photo-1234576.jpeg', // Placeholder
    description: 'Barcelona Sagrada Familia'
  }
];

async function uploadImages() {
  console.log('Starting to upload destination images to Cloudinary...');
  
  const results = [];
  
  for (const image of imagesToUpload) {
    try {
      console.log(`Uploading ${image.name}...`);
      
      const uploadResult = await cloudinary.uploader.upload(image.url, {
        folder: 'worldtripagency/destinations',
        resource_type: 'image',
        public_id: `${image.name}-main`,
        tags: ['destination', image.name]
      });
      
      results.push({
        name: image.name,
        success: true,
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id
      });
      
      console.log(`✅ Uploaded ${image.name}: ${uploadResult.secure_url}`);
      
    } catch (error) {
      console.error(`❌ Failed to upload ${image.name}:`, error.message);
      results.push({
        name: image.name,
        success: false,
        error: error.message
      });
    }
  }
  
  console.log('\n📊 Upload Results:');
  console.log(JSON.stringify(results, null, 2));
  
  return results;
}

// Run the upload
uploadImages()
  .then(() => {
    console.log('✅ Upload process completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Upload process failed:', error);
    process.exit(1);
  });
