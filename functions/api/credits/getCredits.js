import { requireUser } from '../../_lib/auth.js';
import { json } from '../../_lib/response.js';

export async function onRequestPost(context) {
  const session = await requireUser(context);
  if (session.response) return session.response;

  return json({ credits: session.profile.credits, role: session.profile.role });
}
