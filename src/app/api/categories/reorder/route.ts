import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth/requireAdmin';

export async function POST(req: Request) {
  await requireAdmin();
  const supabase = createSupabaseServer();

  const items: { id: string; sort_order: number }[] = await req.json();

  const { error } = await supabase
    .from('categories')
    .upsert(items);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
