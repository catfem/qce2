import { requireUser, assertRole } from '../_lib/auth.js';
import { errorResponse, json } from '../_lib/response.js';

const ALLOWED_ROLES = ['user', 'moderator', 'admin'];

export async function onRequestPost(context) {
  const session = await requireUser(context);
  if (session.response) return session.response;

  const forbidden = assertRole(session.profile, ['admin']);
  if (forbidden) return forbidden;

  const { userId, role } = await context.request.json();
  if (!userId || !role) {
    return errorResponse('userId and role are required', 400);
  }
  if (!ALLOWED_ROLES.includes(role)) {
    return errorResponse('Unsupported role', 400);
  }

  const { data, error } = await session.supabase
    .from('users')
    .update({ role })
    .eq('id', userId)
    .select('id, role')
    .single();
  if (error) {
    return errorResponse('Unable to update role', 500, error);
  }

  return json({ profile: data });
}
