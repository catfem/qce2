export const ROLES = {
  user: 'user',
  moderator: 'moderator',
  admin: 'admin'
};

export const DEFAULT_AI_EXTRACTION_COST = Number(import.meta.env.VITE_AI_EXTRACTION_COST ?? 5);
export const REVIEW_CREDIT_COST = Number(import.meta.env.VITE_REVIEW_CREDIT_COST ?? 2);

export const STORAGE_BUCKET = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'question-files';

export const QUESTION_DIFFICULTY = ['Easy', 'Medium', 'Hard', 'Expert'];
export const QUESTION_CATEGORIES = ['Mathematics', 'Science', 'History', 'Language', 'Technology', 'General'];

export const QUESTION_STATUSES = {
  draft: 'draft',
  published: 'published',
  archived: 'archived'
};

export const FILE_ACCEPTED_TYPES = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'text/plain': ['.txt']
};
