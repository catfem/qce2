import { requireUser, assertRole } from '../_lib/auth.js';
import { errorResponse, json } from '../_lib/response.js';
import { getServiceSupabase } from '../_lib/supabase.js';

export async function onRequestPost(context) {
  const session = await requireUser(context);
  if (session.response) return session.response;

  const forbidden = assertRole(session.profile, ['admin']);
  if (forbidden) return forbidden;

  const supabase = getServiceSupabase(context.env);
  const { data, error } = await supabase
    .from('credits_ledger')
    .select('id, user_id, amount, reason, created_at')
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) {
    return errorResponse('Unable to load ledger', 500, error);
  }

  return json({ entries: data });
}
