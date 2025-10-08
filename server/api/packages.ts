import { serverSupabaseClient } from '#supabase/server';
import { defineEventHandler } from 'h3';

// GET /api/packages
export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event);
  // Join packages with package_options
  const { data, error } = await client
    .from('packages')
    .select(`
      id, image_url, title_ar, title_en, description_ar, description_en, travel_period, duration_days, price, max_persons, featured,
      package_options:package_options (flight, hotel, transportation, hotel_grade)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    return { error: error.message };
  }
  // Format to match composable expectations
  return {
    packages: (data || []).map(pkg => ({
      id: pkg.id,
      image_url: pkg.image_url,
      title_ar: pkg.title_ar,
      title_en: pkg.title_en,
      description_ar: pkg.description_ar,
      description_en: pkg.description_en,
      travel_period: pkg.travel_period,
      duration_days: pkg.duration_days,
      price: pkg.price,
      max_persons: pkg.max_persons,
      featured: pkg.featured,
      included_options: pkg.package_options ? {
        flight: pkg.package_options.flight,
        hotel: pkg.package_options.hotel,
        transportation: pkg.package_options.transportation,
        hotelGrade: pkg.package_options.hotel_grade,
      } : undefined,
    }))
  };
});
