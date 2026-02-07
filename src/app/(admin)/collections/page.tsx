import CollectionsClient from './CollectionsClient';
import { createSupabaseServer } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth/requireAdmin';

export default async function CollectionsPage() {

  await requireAdmin();

  const supabase = createSupabaseServer();

  const { data, error } = await supabase
    .from('collections')
    .select(`
    *,
    products:products(count)
  `)
    .order('sort_order', { ascending: true });

  const collectionsWithCount = (data ?? []).map((cat) => ({
    ...cat,
    product_count: cat.products?.[0]?.count ?? 0,
  }));


  return (
    <CollectionsClient
      initialCollections={collectionsWithCount}
    />
  );
}
