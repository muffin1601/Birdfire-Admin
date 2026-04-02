import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth/requireAdmin';


export async function GET() {
  await requireAdmin();
  const supabase = createSupabaseServer();

  const { data, error } = await supabase
    .from('categories')
    .select(`
      *,
      products:products(count)
    `)
    .order('sort_order', { ascending: true });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  const categoriesWithCount = (data ?? []).map((category) => ({
    ...category,
    product_count: category.products?.[0]?.count ?? 0,
  }));

  return NextResponse.json(categoriesWithCount);
}


export async function POST(req: Request) {
  await requireAdmin();
  const supabase = createSupabaseServer();

  const body = await req.json();

  const { data, error } = await supabase
    .from('categories')
    .insert({
      name: body.name,
      slug: body.slug,
      description: body.description ?? null,
      image_url: body.image_url ?? null,
      banner_url: body.banner_url ?? null,
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
