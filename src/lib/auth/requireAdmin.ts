// src/lib/auth/requireAdmin.ts
import { redirect } from 'next/navigation';
import { createSupabaseServer } from '@/lib/supabase/server';

export async function requireAdmin() {
  const supabase = createSupabaseServer();

  if (!supabase) {
    throw new Error('Supabase server client is undefined');
  }

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();


  if (!user || error) {
    redirect('/login');
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, is_active')
    .eq('id', user.id)
    .single();


  if (!profile || profileError) {
    redirect('/login');
  }

  if (profile.role !== 'admin' || profile.is_active !== true) {
    redirect('/login');
  }

}
