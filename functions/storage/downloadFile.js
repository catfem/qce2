import { requireUser } from '../_lib/auth.js';
import { errorResponse, json } from '../_lib/response.js';
import { getServiceSupabase } from '../_lib/supabase.js';

export async function onRequestPost(context) {
  const session = await requireUser(context);
  if (session.response) return session.response;

  const { path } = await context.request.json();
  if (!path) return errorResponse('path required', 400);

  if (!path.startsWith(session.user.id) && session.profile.role === 'user') {
    return errorResponse('Forbidden', 403);
  }

  const supabase = getServiceSupabase(context.env);
  const bucket = context.env.SUPABASE_STORAGE_BUCKET || 'question-files';
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 60 * 10);
  if (error) {
    return errorResponse('Unable to create download URL', 500, error);
  }

  return json({ url: data.signedUrl });
}
