-- Sample data for local previews / demos

insert into public.users (id, email, display_name, role, credits)
values
  ('00000000-0000-0000-0000-000000000001', 'admin@example.com', 'Ada Admin', 'admin', 9999),
  ('00000000-0000-0000-0000-000000000002', 'moderator@example.com', 'Max Moderator', 'moderator', 120),
  ('00000000-0000-0000-0000-000000000003', 'author@example.com', 'Uma Author', 'user', 60)
on conflict (id) do update set
  email = excluded.email,
  display_name = excluded.display_name,
  role = excluded.role,
  credits = excluded.credits,
  updated_at = now();

insert into public.question_sets (id, name, description, tags, is_private, creator_id)
values
  ('10000000-0000-0000-0000-000000000001', 'STEM Fundamentals', 'Entry-level maths and physics review items.', array['stem','foundation'], false, '00000000-0000-0000-0000-000000000001'),
  ('10000000-0000-0000-0000-000000000002', 'Private Drafts', 'Work-in-progress questions for moderator review.', array['draft','review'], true, '00000000-0000-0000-0000-000000000003')
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  tags = excluded.tags,
  is_private = excluded.is_private,
  creator_id = excluded.creator_id,
  updated_at = now();

insert into public.questions (
  id,
  question_set_id,
  creator_id,
  title,
  body,
  explanation,
  answer,
  options,
  tags,
  difficulty,
  category,
  "references",
  is_private,
  status
) values
  (
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'What is Newton''s Second Law?',
    'State Newton''s Second Law of Motion and explain the relationship between force, mass, and acceleration.',
    'Newton''s Second Law states that the force acting on an object is equal to the mass of that object times its acceleration (F = m·a).',
    'F = m·a',
    '[{"label":"A","value":"F = m·a","isCorrect":true},{"label":"B","value":"F = m/m"},{"label":"C","value":"F = m+a"},{"label":"D","value":"F = a/m"}]'::jsonb,
    array['physics','fundamentals'],
    'Medium',
    'Science',
    'Halliday & Resnick, 10th Edition',
    false,
    'published'
  ),
  (
    '20000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000003',
    'Derive the quadratic formula',
    'Show the steps required to derive the quadratic formula starting from ax² + bx + c = 0.',
    'Complete the square: divide by a, isolate constant, add (b/2a)² to both sides, and solve for x.',
    'x = (-b ± √(b²-4ac)) / (2a)',
    '[{"label":"A","value":"x = (-b ± √(b²-4ac)) / (2a)","isCorrect":true},{"label":"B","value":"x = (b ± √(b²-4ac)) / (2a)"},{"label":"C","value":"x = (-b ± √(b²+4ac)) / (2a)"},{"label":"D","value":"x = (-b ± √(4ac)) / (2a)"}]'::jsonb,
    array['algebra','derivation'],
    'Hard',
    'Mathematics',
    'OpenStax Algebra II',
    true,
    'draft'
  )
on conflict (id) do update set
  question_set_id = excluded.question_set_id,
  creator_id = excluded.creator_id,
  title = excluded.title,
  body = excluded.body,
  explanation = excluded.explanation,
  answer = excluded.answer,
  options = excluded.options,
  tags = excluded.tags,
  difficulty = excluded.difficulty,
  category = excluded.category,
  "references" = excluded."references",
  is_private = excluded.is_private,
  status = excluded.status,
  updated_at = now();

insert into public.credits_ledger (id, user_id, amount, reason, metadata)
values
  ('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 5000, 'Initial admin allocation', '{"source":"seed"}'::jsonb),
  ('30000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 100, 'Moderator top-up', '{"source":"seed"}'::jsonb),
  ('30000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000003', 60, 'Initial user credits', '{"source":"seed"}'::jsonb)
on conflict (id) do update set
  user_id = excluded.user_id,
  amount = excluded.amount,
  reason = excluded.reason,
  metadata = excluded.metadata;

insert into public.ai_logs (id, user_id, file_path, status, latency_ms, metadata)
values
  ('40000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000003', 'seed/demo.pdf', 'success', 742, '{"fileName":"demo.pdf","aiCost":5}'::jsonb),
  ('40000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'seed/sample.docx', 'failed', 210, '{"fileName":"sample.docx","error":"Quota exceeded"}'::jsonb)
on conflict (id) do nothing;
