import { requireUser } from '../../_lib/auth.js';
import { errorResponse, json } from '../../_lib/response.js';

export async function onRequestPost(context) {
  const session = await requireUser(context);
  if (session.response) return session.response;

  const { id } = await context.request.json();
  if (!id) return errorResponse('Question id is required', 400);

  const { data: question, error: fetchError } = await session.supabase
    .from('questions')
    .select('id, creator_id')
    .eq('id', id)
    .single();
  if (fetchError || !question) {
    return errorResponse('Question not found', 404);
  }

  if (session.profile.role === 'user' && question.creator_id !== session.user.id) {
    return errorResponse('You are not allowed to delete this question', 403);
  }

  const { error } = await session.supabase.from('questions').delete().eq('id', id);
  if (error) {
    return errorResponse('Unable to delete question', 500, error);
  }

  return json({ success: true });
}
