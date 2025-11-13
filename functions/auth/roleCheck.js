import { requireUser } from '../_lib/auth.js';
import { json } from '../_lib/response.js';

export async function onRequest(context) {
  if (context.request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  const session = await requireUser(context);
  if (session.response) return session.response;

  return json({
    profile: session.profile
  });
}
