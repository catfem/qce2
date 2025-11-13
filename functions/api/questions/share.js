import { requireUser, assertRole } from '../../_lib/auth.js';
import { errorResponse, json } from '../../_lib/response.js';

export async function onRequestPost(context) {
  const session = await requireUser(context);
  if (session.response) return session.response;

  const forbidden = assertRole(session.profile, ['moderator', 'admin']);
  if (forbidden) return forbidden;

  const { setId, email } = await context.request.json();
  if (!setId || !email) {
    return errorResponse('setId and email are required', 400);
  }

  const { data: targetUser, error: userError } = await session.supabase
    .from('users')
    .select('id, email')
    .eq('email', email)
    .maybeSingle();
  if (userError) {
    return errorResponse('Unable to locate target user', 500, userError);
  }

  const { data: share, error } = await session.supabase
    .from('question_set_shares')
    .insert({
      question_set_id: setId,
      owner_id: session.user.id,
      recipient_email: email,
      recipient_user_id: targetUser?.id || null
    })
    .select('*')
    .single();
  if (error) {
    return errorResponse('Unable to share question set', 500, error);
  }

  return json({ share });
}
