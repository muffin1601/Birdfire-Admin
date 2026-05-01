import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth/requireAdmin';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  await requireAdmin();
  const supabase = createSupabaseServer();

  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json(data);
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  await requireAdmin();
  const supabase = createSupabaseServer();
  const body = await req.json();

  const { data, error } = await supabase
    .from('brands')
    .update({
      name: body.name,
      slug: body.slug,
      description: body.description,
      logo_url: body.logo_url,
      is_active: body.is_active,
      sort_order: body.sort_order,
    })
    .eq('id', params.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json(data);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await requireAdmin();
  const supabase = createSupabaseServer();

  const { error } = await supabase
    .from('brands')
    .delete()
    .eq('id', params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
