import { TypedSupabaseClient } from '@/utils/supabase/types'

export function getJobById(client: TypedSupabaseClient, jobId: number) {
  return client
    .from('jobs')
    .select(`
      id,
      title
    `)
    .eq('id', jobId)
    .throwOnError()
    .single()
}