import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth/requireAdmin';


export async function GET() {
  await requireAdmin();
  const supabase = createSupabaseServer();

  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}


export async function POST(req: Request) {
  await requireAdmin();
  const supabase = createSupabaseServer();

  const body = await req.json();

  const { data, error } = await supabase
    .from('collections')
    .insert({
      name: body.name,
      slug: body.slug,
      description: body.description ?? null,
      image_url: body.image_url ?? null,
      image_alt: body.image_alt ?? null,
      is_active: body.is_active ?? true,
      sort_order: body.sort_order ?? 0,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data, { status: 201 });
}
