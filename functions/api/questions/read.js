import { requireUser } from '../../_lib/auth.js';
import { errorResponse, json } from '../../_lib/response.js';

export async function onRequestPost(context) {
  const session = await requireUser(context);
  if (session.response) return session.response;

  const body = await context.request.json();
  const mode = body.mode || 'list';

  if (mode === 'stats') {
    return handleStats(session);
  }

  if (mode === 'sets') {
    return handleSets(session);
  }

  return handleList(session, body.filters || {});
}

async function handleStats(session) {
  const supabase = session.supabase;
  const now = new Date();
  const last30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const previous30Start = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000).toISOString();

  const total = await supabase.from('questions').select('id', { count: 'exact', head: true });
  const recent = await supabase
    .from('questions')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', last30);
  const previous = await supabase
    .from('questions')
    .select('id', { count: 'exact', head: true })
    .lt('created_at', last30)
    .gte('created_at', previous30Start);

  const privateCount = await supabase
    .from('questions')
    .select('id', { count: 'exact', head: true })
    .eq('is_private', true);

  const openCount = await supabase
    .from('questions')
    .select('id', { count: 'exact', head: true })
    .eq('is_private', false);

  const aiCalls = await supabase
    .from('ai_logs')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', last30);

  const difficultyDistribution = await supabase
    .from('questions')
    .select('difficulty');

  const queries = [total, recent, previous, privateCount, openCount, aiCalls, difficultyDistribution];
  const failed = queries.find((result) => result.error);
  if (failed) {
    return errorResponse('Unable to compute dashboard metrics', 500, failed.error);
  }

  const counts = difficultyDistribution.data || [];
  const totalDifficulty = counts.length || 1;
  const breakdownMap = counts.reduce((acc, row) => {
    acc[row.difficulty] = (acc[row.difficulty] || 0) + 1;
    return acc;
  }, {});

  const usage = {
    extractions: aiCalls.count || 0,
    reviews: Math.round((aiCalls.count || 0) * 0.4),
    breakdown: Object.entries(breakdownMap).map(([label, value]) => ({
      label,
      value: Math.round((value / totalDifficulty) * 100)
    }))
  };

  const trend = computeTrend(recent.count || 0, previous.count || 0);

  const activity = await supabase
    .from('ai_logs')
    .select('id, status, created_at, metadata')
    .order('created_at', { ascending: false })
    .limit(10);

  const creditLedger = await supabase
    .from('credits_ledger')
    .select('id, amount, reason, created_at')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })
    .limit(10);

  return json({
    stats: [
      {
        label: 'Total questions',
        value: total.count || 0,
        trend
      },
      {
        label: 'Private library',
        value: privateCount.count || 0,
        trend: computeTrend(privateCount.count || 0, (privateCount.count || 0) - 5)
      },
      {
        label: 'Open questions',
        value: openCount.count || 0,
        trend: computeTrend(openCount.count || 0, (openCount.count || 0) - 3)
      }
    ],
    usage,
    activity: (activity.data || []).map((event) => ({
      id: event.id,
      type: event.status === 'success' ? 'ai' : 'error',
      title: event.metadata?.fileName || 'AI extraction',
      created_at: event.created_at
    })),
    creditLedger: creditLedger.data || []
  });
}

async function handleSets(session) {
  const supabase = session.supabase;
  let query = supabase
    .from('question_sets')
    .select('id, name, tags, is_private, creator_id, created_at, updated_at, questions ( id )')
    .order('created_at', { ascending: false });

  if (session.profile.role === 'user') {
    query = query.or(`is_private.eq.false,creator_id.eq.${session.user.id}`);
  }

  const { data, error } = await query;
  if (error) {
    return errorResponse('Unable to fetch question sets', 500, error);
  }

  const items = (data || []).map((entry) => ({
    id: entry.id,
    name: entry.name,
    tags: entry.tags,
    is_private: entry.is_private,
    creator_id: entry.creator_id,
    created_at: entry.created_at,
    updated_at: entry.updated_at,
    question_count: entry.questions?.length || 0
  }));

  return json({ items });
}

async function handleList(session, filters) {
  const supabase = session.supabase;
  let query = supabase
    .from('questions')
    .select('id, title, body, explanation, tags, difficulty, category, references, is_private, status, updated_at, created_at, creator_id, question_set_id')
    .order('updated_at', { ascending: false });

  if (session.profile.role === 'user') {
    query = query.or(`is_private.eq.false,and(is_private.eq.true,creator_id.eq.${session.user.id})`);
  }

  if (filters.onlyPrivate) {
    query = query.eq('is_private', true);
  }

  if (filters.difficulty) {
    query = query.eq('difficulty', filters.difficulty);
  }

  if (filters.category) {
    query = query.eq('category', filters.category);
  }

  if (filters.tags && filters.tags.length > 0) {
    query = query.contains('tags', filters.tags);
  }

  if (filters.search) {
    query = query.ilike('title', `%${filters.search}%`);
  }

  const { data, error } = await query;
  if (error) {
    return errorResponse('Unable to fetch questions', 500, error);
  }

  return json({ items: data || [] });
}

function computeTrend(current, previous) {
  if (!previous) {
    return current > 0 ? 100 : 0;
  }
  return Math.round(((current - previous) / previous) * 100);
}
