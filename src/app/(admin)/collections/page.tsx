import CollectionsClient from './CollectionsClient';
import { createSupabaseServer } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth/requireAdmin';

export default async function CollectionsPage() {
  
  await requireAdmin();


  const supabase = createSupabaseServer();

  
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }


  return (
    <CollectionsClient
      initialCollections={data ?? []}
    />
  );
}
