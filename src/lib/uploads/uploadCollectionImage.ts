import { supabase } from '@/lib/supabase/client'

export async function uploadCollectionImage(file: File): Promise<string> {
  const ext = file.name.split('.').pop()
  const filePath = `collections/${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage
    .from('collection-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    throw new Error(error.message)
  }

  const { data } = supabase.storage
    .from('collection-images')
    .getPublicUrl(filePath)

  return data.publicUrl
}
