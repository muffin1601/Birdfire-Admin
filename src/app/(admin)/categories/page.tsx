import CategoriesClient from './CategoriesClient';
import { createSupabaseServer } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth/requireAdmin';

export default async function CategoriesPage() {

  await requireAdmin();

  const supabase = createSupabaseServer();

  const { data, error } = await supabase
    .from('categories')
    .select(`
    *,
    products:products(count)
  `)
    .order('sort_order', { ascending: true });

  const categoriesWithCount = (data ?? []).map((cat) => ({
    ...cat,
    product_count: cat.products?.[0]?.count ?? 0,
  }));


  return (
    <CategoriesClient
      initialCategories={categoriesWithCount}
    />
  );
}
