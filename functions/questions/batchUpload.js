import { requireUser } from '../_lib/auth.js';
import { errorResponse, json } from '../_lib/response.js';

export async function onRequestPost(context) {
  const session = await requireUser(context);
  if (session.response) return session.response;

  const body = await context.request.json();
  const questions = body.questions;
  if (!Array.isArray(questions) || questions.length === 0) {
    return errorResponse('questions array is required', 400);
  }

  const metadata = body.metadata || {};
  let questionSetId = metadata.questionSetId || null;

  if (!questionSetId) {
    const { data: set, error } = await session.supabase
      .from('question_sets')
      .insert({
        name: metadata.questionSetName || 'Imported set',
        is_private: metadata.isPrivate ?? true,
        creator_id: session.user.id,
        tags: metadata.tags || null
      })
      .select('id')
      .single();
    if (error) {
      return errorResponse('Unable to create question set', 500, error);
    }
    questionSetId = set.id;
  }

  const payload = questions.map((question) => ({
    creator_id: session.user.id,
    question_set_id: questionSetId,
    title: question.title,
    body: question.body,
    explanation: question.explanation,
    answer: question.answer,
    options: question.options || null,
    tags: question.tags || null,
    difficulty: question.difficulty || 'Medium',
    category: question.category || 'General',
    references: question.references || null,
    is_private: metadata.isPrivate ?? true,
    status: session.profile.role === 'user' ? 'draft' : 'published'
  }));

  const { data, error } = await session.supabase.from('questions').insert(payload).select('*');
  if (error) {
    return errorResponse('Unable to save questions', 500, error);
  }

  return json({
    question_set_id: questionSetId,
    inserted: data.length
  });
}
