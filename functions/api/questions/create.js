import { requireUser } from '../../_lib/auth.js';
import { errorResponse, json } from '../../_lib/response.js';

export async function onRequestPost(context) {
  const session = await requireUser(context);
  if (session.response) return session.response;

  const payload = await context.request.json();
  if (!payload.title || !payload.body) {
    return errorResponse('Title and body are required', 400);
  }

  const insertPayload = {
    creator_id: session.user.id,
    title: payload.title,
    body: payload.body,
    explanation: payload.explanation,
    answer: payload.answer,
    options: payload.options || null,
    tags: payload.tags || null,
    difficulty: payload.difficulty || 'Medium',
    category: payload.category || 'General',
    references: payload.references || null,
    is_private: payload.is_private ?? true,
    question_set_id: payload.question_set_id || null,
    status: payload.status || (session.profile.role === 'user' ? 'draft' : 'published')
  };

  const { data, error } = await session.supabase
    .from('questions')
    .insert(insertPayload)
    .select('*')
    .single();
  if (error) {
    return errorResponse('Unable to create question', 500, error);
  }

  return json({ question: data });
}
