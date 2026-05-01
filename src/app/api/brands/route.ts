import { NextResponse } from 'next/server';
import { createSupabaseServer } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth/requireAdmin';

export async function GET() {
  try {
    await requireAdmin();
    const supabase = createSupabaseServer();

    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Supabase Error (Brands):', error.message);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data || []);
  } catch (err: any) {
    // If requireAdmin redirects, Next.js handles it. 
    // If it's a real error, we catch it here.
    if (err.digest?.startsWith('NEXT_REDIRECT')) throw err;
    
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const supabase = createSupabaseServer();
    const body = await req.json();

    const { data, error } = await supabase
      .from('brands')
      .insert({
        name: body.name,
        slug: body.slug,
        description: body.description ?? null,
        logo_url: body.logo_url ?? null,
        is_active: body.is_active ?? true,
        sort_order: body.sort_order ?? 0,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    if (err.digest?.startsWith('NEXT_REDIRECT')) throw err;
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
