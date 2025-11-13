import { requireUser } from '../../_lib/auth.js';
import { errorResponse, json } from '../../_lib/response.js';
import { deductCreditsTx } from '../../_lib/credits.js';

export async function onRequestPost(context) {
  const session = await requireUser(context);
  if (session.response) return session.response;

  const { amount, metadata } = await context.request.json();
  const value = Number(amount);
  if (!value || value <= 0) {
    return errorResponse('Amount must be greater than zero', 400);
  }

  try {
    const result = await deductCreditsTx(session.supabase, session.user.id, value, metadata);
    return json(result);
  } catch (error) {
    if (error.code === 'INSUFFICIENT_CREDITS') {
      return errorResponse(error.message, 402);
    }
    return errorResponse('Unable to deduct credits', 500, error.message);
  }
}
