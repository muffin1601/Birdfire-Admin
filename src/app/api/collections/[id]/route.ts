import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth/requireAdmin';

type Params = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * PATCH /api/collections/:id
 * Update collection
 */
export async function PATCH(
  req: Request,
  { params }: Params
) {
  await requireAdmin();
  const supabase = createSupabaseServer();


  const { id } = await params;

  const body = await req.json();

  const { data, error } = await supabase
    .from('collections')
    .update({
      name: body.name,
      slug: body.slug,
      description: body.description ?? null,
      image_url: body.image_url ?? null,
      image_alt: body.image_alt ?? null,
      is_active: body.is_active,
      sort_order: body.sort_order,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json(data);
}

/**
 * DELETE /api/collections/:id
 * Delete collection
 */
export async function DELETE(
  _req: Request,
  { params }: Params
) {
  await requireAdmin();
  const supabase = createSupabaseServer();


  const { id } = await params;

  const { error } = await supabase
    .from('collections')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}
