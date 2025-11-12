import { QUESTION_CATEGORIES, QUESTION_DIFFICULTY } from '../../utils/constants.js';
import { Input } from '../ui/Input.jsx';
import { Switch } from '../ui/Switch.jsx';
import { cn } from '../../utils/cn.js';

export function QuestionFilters({ filters, onChange }) {
  const update = (patch) => onChange({ ...filters, ...patch });

  return (
    <div className="glass-panel flex flex-wrap gap-6 p-6">
      <div className="flex-1 min-w-[220px]">
        <label className="text-xs uppercase tracking-wide text-slate-400">Search</label>
        <Input value={filters.search || ''} onChange={(event) => update({ search: event.target.value })} placeholder="Search by title or tag" />
      </div>
      <div className="flex flex-col">
        <label className="text-xs uppercase tracking-wide text-slate-400">Visibility</label>
        <div className="mt-2 flex items-center gap-3 text-sm text-slate-200">
          <Switch checked={filters.onlyPrivate} onChange={(value) => update({ onlyPrivate: value })} />
          <span>{filters.onlyPrivate ? 'Private only' : 'All open questions'}</span>
        </div>
      </div>
      <div>
        <label className="text-xs uppercase tracking-wide text-slate-400">Difficulty</label>
        <select
          value={filters.difficulty || ''}
          onChange={(event) => update({ difficulty: event.target.value || null })}
          className={cn('mt-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/40')}
        >
          <option value="">All levels</option>
          {QUESTION_DIFFICULTY.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-xs uppercase tracking-wide text-slate-400">Category</label>
        <select
          value={filters.category || ''}
          onChange={(event) => update({ category: event.target.value || null })}
          className={cn('mt-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/40')}
        >
          <option value="">All categories</option>
          {QUESTION_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <div className="flex-1 min-w-[200px]">
        <label className="text-xs uppercase tracking-wide text-slate-400">Tags</label>
        <Input
          value={filters.tags?.join(', ') || ''}
          onChange={(event) =>
            update({
              tags: event.target.value
                .split(',')
                .map((tag) => tag.trim())
                .filter(Boolean)
            })
          }
          placeholder="math, algebra, calculus"
        />
      </div>
    </div>
  );
}
