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
    .from('users')
    .select('id, email, display_name, role, credits, created_at')
    .order('created_at', { ascending: true });
  if (error) {
    return errorResponse('Unable to fetch workspace users', 500, error);
  }

  return json({ items: data });
}
