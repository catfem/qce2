import { requireUser } from '../_lib/auth.js';
import { errorResponse, json } from '../_lib/response.js';
import { getServiceSupabase } from '../_lib/supabase.js';

export async function onRequestGet(context) {
  const session = await requireUser(context);
  if (session.response) return session.response;

  const url = new URL(context.request.url);
  const jobId = url.searchParams.get('jobId');
  if (!jobId) {
    return errorResponse('Missing jobId', 400);
  }

  const supabase = getServiceSupabase(context.env);
  const { data, error } = await supabase
    .from('ai_logs')
    .select('*')
    .eq('id', jobId)
    .eq('user_id', session.user.id)
    .single();
  if (error) {
    return errorResponse('Unable to locate job', 404, error);
  }

  return json({ job: data });
}
