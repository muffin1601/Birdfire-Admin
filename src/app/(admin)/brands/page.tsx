import { createSupabaseServer } from '@/lib/supabase/server';
import BrandsClient from './BrandsClient';

export const dynamic = 'force-dynamic';

export default async function BrandsPage() {
  const supabase = createSupabaseServer();

  // Try to fetch brands and their product count
  const { data, error } = await supabase
    .from('brands')
    .select(`
      *,
      products:products(count)
    `)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching brands with count:', error.message);
    
    // Fallback: try fetching without the join in case relationship is missing
    const { data: simpleData, error: simpleError } = await supabase
      .from('brands')
      .select('*')
      .order('name', { ascending: true });

    if (simpleError) {
      console.error('Error fetching brands simple:', simpleError.message);
      return (
        <div style={{ padding: 20, color: '#ef4444' }}>
          <h3>Database Error</h3>
          <p>{simpleError.message}</p>
          <p>Please ensure the "brands" table exists in your database.</p>
        </div>
      );
    }
    
    return <BrandsClient initialBrands={simpleData || []} />;
  }

  const brandsWithCount = (data ?? []).map((brand: any) => ({
    ...brand,
    product_count: brand.products?.[0]?.count ?? 0,
  }));

  return <BrandsClient initialBrands={brandsWithCount} />;
}
