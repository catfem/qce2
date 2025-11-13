import { requireUser } from '../_lib/auth.js';
import { errorResponse, json } from '../_lib/response.js';

export async function onRequestPost(context) {
  const session = await requireUser(context);
  if (session.response) return session.response;

  const { setId } = await context.request.json();
  if (!setId) return errorResponse('setId is required', 400);

  const { data: set, error } = await session.supabase
    .from('question_sets')
    .select('*, questions(*)')
    .eq('id', setId)
    .single();
  if (error || !set) {
    return errorResponse('Question set not found', 404, error);
  }

  if (session.profile.role === 'user' && set.is_private && set.creator_id !== session.user.id) {
    return errorResponse('You are not allowed to export this set', 403);
  }

  return json({ set, questions: set.questions || [] });
}
