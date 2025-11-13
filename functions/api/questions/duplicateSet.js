import { requireUser } from '../../_lib/auth.js';
import { errorResponse, json } from '../../_lib/response.js';

export async function onRequestPost(context) {
  const session = await requireUser(context);
  if (session.response) return session.response;

  const { setId } = await context.request.json();
  if (!setId) return errorResponse('setId is required', 400);

  const { data: set, error: setError } = await session.supabase
    .from('question_sets')
    .select('*')
    .eq('id', setId)
    .single();
  if (setError || !set) {
    return errorResponse('Question set not found', 404);
  }

  if (session.profile.role === 'user' && set.creator_id !== session.user.id) {
    return errorResponse('You cannot duplicate this set', 403);
  }

  const { data: newSet, error: insertError } = await session.supabase
    .from('question_sets')
    .insert({
      name: `${set.name} (Copy)`,
      tags: set.tags,
      is_private: set.is_private,
      creator_id: session.user.id
    })
    .select('*')
    .single();
  if (insertError) {
    return errorResponse('Unable to create duplicated set', 500, insertError);
  }

  const { data: questions, error: questionsError } = await session.supabase
    .from('questions')
    .select('*')
    .eq('question_set_id', setId);
  if (questionsError) {
    return errorResponse('Unable to read questions for duplication', 500, questionsError);
  }

  if (questions && questions.length > 0) {
    const payload = questions.map((question) => ({
      creator_id: session.user.id,
      question_set_id: newSet.id,
      title: question.title,
      body: question.body,
      explanation: question.explanation,
      answer: question.answer,
      options: question.options,
      tags: question.tags,
      difficulty: question.difficulty,
      category: question.category,
      references: question.references,
      is_private: set.is_private,
      status: question.status
    }));
    const { error: insertQuestionsError } = await session.supabase.from('questions').insert(payload);
    if (insertQuestionsError) {
      return errorResponse('Unable to copy questions', 500, insertQuestionsError);
    }
  }

  return json({ set: newSet });
}
