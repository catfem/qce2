import { requireUser, assertRole } from '../_lib/auth.js';
import { errorResponse, json } from '../_lib/response.js';
import { getServiceSupabase } from '../_lib/supabase.js';
import { addCredits } from '../_lib/credits.js';

export async function onRequestPost(context) {
  const session = await requireUser(context);
  if (session.response) return session.response;

  const forbidden = assertRole(session.profile, ['admin']);
  if (forbidden) return forbidden;

  const { userId, amount } = await context.request.json();
  if (!userId || typeof amount !== 'number') {
    return errorResponse('userId and amount are required', 400);
  }

  const supabase = getServiceSupabase(context.env);
  try {
    const updated = await addCredits(supabase, userId, amount, 'Manual allocation');
    return json({ credits: updated.credits });
  } catch (error) {
    return errorResponse('Unable to allocate credits', 500, error.message);
  }
}
