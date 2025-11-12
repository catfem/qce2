import { requireUser } from '../_lib/auth.js';
import { errorResponse, json } from '../_lib/response.js';

export async function onRequestPost(context) {
  const session = await requireUser(context);
  if (session.response) return session.response;

  const { name, is_private = true, tags = [] } = await context.request.json();
  if (!name) return errorResponse('Name is required', 400);

  const { data, error } = await session.supabase
    .from('question_sets')
    .insert({
      name,
      is_private,
      tags,
      creator_id: session.user.id
    })
    .select('*')
    .single();
  if (error) {
    return errorResponse('Unable to create set', 500, error);
  }

  return json({ set: data });
}
