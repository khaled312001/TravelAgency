<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="relative bg-cover bg-center py-20">
      <div class="absolute inset-0">
        <img
          src="/images/home/heroSection/hero-image.webp"
          alt="وجهات سفر متميزة في المملكة العربية السعودية"
          class="w-full h-full object-cover"
          loading="eager"
        />
        <div class="absolute inset-0 bg-black/40"></div>
      </div>
      <div class="container relative z-10 mx-auto px-4 text-center text-white">
        <h1 class="mb-6 text-4xl font-bold md:text-6xl lg:text-7xl">
          وجهات السفر المتميزة
        </h1>
        <p class="mb-8 text-xl md:text-2xl">
          اكتشف أجمل الوجهات السياحية في المملكة العربية السعودية
        </p>
      </div>
    </section>

    <!-- Destinations Grid -->
    <section class="py-16">
      <div class="container">
        <div v-if="pending" class="flex justify-center items-center min-h-[400px]">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
        <div v-else-if="error" class="text-center text-red-500">
          حدث خطأ في تحميل الوجهات
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <DestinationCard
            v-for="(destination, index) in destinations"
            :key="index"
            :destination="destination"
          />
        </div>
      </div>
    </section>

    <!-- SEO Content Section -->
    <section class="py-16 bg-gray-50">
      <div class="container">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl font-bold text-gray-900 mb-8">
            أفضل الوجهات السياحية في المملكة العربية السعودية
          </h2>
          <div class="prose prose-lg mx-auto text-gray-600">
            <p class="mb-6">
              المملكة العربية السعودية موطن لأروع الوجهات السياحية التي تجمع بين الأصالة والحداثة. 
              من المدن المقدسة مكة المكرمة والمدينة المنورة إلى المدن الحديثة مثل الرياض وجدة، 
              ومن المناطق الطبيعية الخلابة مثل العلا وأبها إلى الشواطئ الساحرة في البحر الأحمر.
            </p>
            <p class="mb-6">
              اكتشف معنا أجمل الوجهات السياحية في المملكة العربية السعودية. نقدم لك باقات سفر متميزة 
              تشمل أفضل الفنادق والأنشطة السياحية، مع مرشدين محترفين وخدمة 24/7 لضمان رحلة لا تُنسى.
            </p>
            <h3 class="text-2xl font-semibold text-gray-900 mb-4">
              لماذا تختار World Trip Agency؟
            </h3>
            <ul class="text-left space-y-2">
              <li>• خبرة أكثر من 10 سنوات في مجال السياحة والسفر</li>
              <li>• باقات سفر متميزة بأسعار منافسة</li>
              <li>• خدمة عملاء متاحة 24/7</li>
              <li>• مرشدين سياحيين محترفين</li>
              <li>• ضمان أفضل الفنادق والخدمات</li>
              <li>• رحلات مخصصة حسب احتياجاتك</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import DestinationCard from '~/components/destinations/DestinationCard.vue'
const { getDestinations } = useDestinations()

// SEO Meta Tags
useHead({
  title: 'وجهات السفر المتميزة - أرض العجائب للسفر | سياحة السعودية',
  meta: [
    {
      name: 'description',
      content: 'اكتشف أجمل الوجهات السياحية في المملكة العربية السعودية. من المدن المقدسة مكة والمدينة إلى العلا وأبها والبحر الأحمر. باقات سفر متميزة مع أفضل الخدمات.'
    },
    {
      name: 'keywords',
      content: 'وجهات سفر السعودية, سياحة السعودية, مكة المكرمة, المدينة المنورة, الرياض, جدة, الدمام, العلا, أبها, تبوك, حائل, الباحة, نجران, جازان, القصيم, الحدود الشمالية, عسير, الجوف, البحر الأحمر, رحلات داخلية, سياحة داخلية'
    },
    { property: 'og:title', content: 'وجهات السفر المتميزة - أرض العجائب للسفر' },
    { property: 'og:description', content: 'اكتشف أجمل الوجهات السياحية في المملكة العربية السعودية. من المدن المقدسة إلى المناطق الطبيعية الخلابة.' },
    { property: 'og:url', content: 'https://www.worldtripagency.com/destinations' },
    { name: 'twitter:title', content: 'وجهات السفر المتميزة - أرض العجائب للسفر' },
    { name: 'twitter:description', content: 'اكتشف أجمل الوجهات السياحية في المملكة العربية السعودية. من المدن المقدسة إلى المناطق الطبيعية الخلابة.' }
  ],
  link: [
    { rel: 'canonical', href: 'https://www.worldtripagency.com/destinations' }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "وجهات السفر المتميزة في المملكة العربية السعودية",
        "description": "مجموعة شاملة من أجمل الوجهات السياحية في المملكة العربية السعودية",
        "url": "https://www.worldtripagency.com/destinations",
        "numberOfItems": "15+",
        "itemListElement": [
          {
            "@type": "TouristDestination",
            "name": "مكة المكرمة",
            "description": "أقدس مدينة في الإسلام ووجهة الحج والعمرة",
            "url": "https://www.worldtripagency.com/destinations/makkah"
          },
          {
            "@type": "TouristDestination",
            "name": "المدينة المنورة",
            "description": "ثاني أقدس مدينة في الإسلام مع المسجد النبوي الشريف",
            "url": "https://www.worldtripagency.com/destinations/medina"
          },
          {
            "@type": "TouristDestination",
            "name": "الرياض",
            "description": "عاصمة المملكة العربية السعودية ومركز الأعمال والثقافة",
            "url": "https://www.worldtripagency.com/destinations/riyadh"
          },
          {
            "@type": "TouristDestination",
            "name": "جدة",
            "description": "عروس البحر الأحمر ومدينة الفنون والثقافة",
            "url": "https://www.worldtripagency.com/destinations/jeddah"
          },
          {
            "@type": "TouristDestination",
            "name": "العلا",
            "description": "مدينة الحجر الأثرية وواحة التاريخ والطبيعة",
            "url": "https://www.worldtripagency.com/destinations/alula"
          },
          {
            "@type": "TouristDestination",
            "name": "أبها",
            "description": "عاصمة عسير ومدينة الضباب والطبيعة الخلابة",
            "url": "https://www.worldtripagency.com/destinations/abha"
          }
        ]
      })
    }
  ]
})

const {
  data: destinations,
  pending,
  error
} = await getDestinations()
</script>
