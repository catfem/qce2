import { requireUser } from '../../_lib/auth.js';
import { errorResponse, json } from '../../_lib/response.js';

export async function onRequestPost(context) {
  const session = await requireUser(context);
  if (session.response) return session.response;

  const { id, payload } = await context.request.json();
  if (!id) {
    return errorResponse('Question id is required', 400);
  }

  const { data: question, error: fetchError } = await session.supabase
    .from('questions')
    .select('*')
    .eq('id', id)
    .single();
  if (fetchError || !question) {
    return errorResponse('Question not found', 404);
  }

  if (session.profile.role === 'user' && question.creator_id !== session.user.id) {
    return errorResponse('You are not allowed to modify this question', 403);
  }

  const updatePayload = { ...payload, updated_at: new Date().toISOString() };

  const { data, error } = await session.supabase
    .from('questions')
    .update(updatePayload)
    .eq('id', id)
    .select('*')
    .single();
  if (error) {
    return errorResponse('Unable to update question', 500, error);
  }

  return json({ question: data });
}
