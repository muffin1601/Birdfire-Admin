import CategoriesClient from './CategoriesClient';
import { createSupabaseServer } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth/requireAdmin';

export default async function CategoriesPage() {
  
  await requireAdmin();


  const supabase = createSupabaseServer();

  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

 
  return (
    <CategoriesClient
      initialCategories={data ?? []}
    />
  );
}
