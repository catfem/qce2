import { requireUser, assertRole } from '../_lib/auth.js';
import { errorResponse, json } from '../_lib/response.js';

export async function onRequestPost(context) {
  const session = await requireUser(context);
  if (session.response) return session.response;

  if (session.profile.role === 'user') {
    const forbidden = assertRole(session.profile, ['moderator', 'admin']);
    if (forbidden) return forbidden;
  }

  const { targetSetId, sourceSetId } = await context.request.json();
  if (!targetSetId || !sourceSetId) {
    return errorResponse('targetSetId and sourceSetId are required', 400);
  }

  const { error } = await session.supabase
    .from('questions')
    .update({ question_set_id: targetSetId })
    .eq('question_set_id', sourceSetId);
  if (error) {
    return errorResponse('Unable to merge question sets', 500, error);
  }

  return json({ success: true });
}
