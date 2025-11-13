import { requireUser } from '../../_lib/auth.js';
import { errorResponse, json } from '../../_lib/response.js';

export async function onRequestPost(context) {
  const session = await requireUser(context);
  if (session.response) return session.response;

  const bucket = context.env.SUPABASE_STORAGE_BUCKET || 'question-files';
  const { fileName } = await context.request.json();
  if (!fileName) {
    return errorResponse('fileName required', 400);
  }

  const path = `${session.user.id}/${Date.now()}-${fileName}`;
  const { data, error } = await session.supabase.storage.from(bucket).createSignedUploadUrl(path);
  if (error) {
    return errorResponse('Unable to create upload URL', 500, error);
  }

  return json({ path, signedUrl: data.signedUrl });
}
