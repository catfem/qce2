import { Badge } from '../ui/Badge.jsx';
import { Button } from '../ui/Button.jsx';
import { fromNow } from '../../utils/formatters.js';

export function QuestionTable({ questions, onEdit, onDelete, onTogglePrivacy, isModerator }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/5 bg-white/5">
      <table className="min-w-full divide-y divide-white/10 text-sm">
        <thead className="bg-white/5 text-left text-xs uppercase tracking-wide text-slate-400">
          <tr>
            <th className="px-6 py-4">Title</th>
            <th className="px-6 py-4">Difficulty</th>
            <th className="px-6 py-4">Category</th>
            <th className="px-6 py-4">Tags</th>
            <th className="px-6 py-4">Visibility</th>
            <th className="px-6 py-4">Updated</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-slate-200">
          {questions.length === 0 && (
            <tr>
              <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                No questions found. Adjust filters or upload new content.
              </td>
            </tr>
          )}
          {questions.map((question) => (
            <tr key={question.id}>
              <td className="max-w-xs px-6 py-4">
                <div className="font-medium text-foreground">{question.title}</div>
                <p className="text-xs text-slate-400">{question.body.slice(0, 90)}{question.body.length > 90 ? '…' : ''}</p>
              </td>
              <td className="px-6 py-4">
                <Badge>{question.difficulty}</Badge>
              </td>
              <td className="px-6 py-4">{question.category}</td>
              <td className="px-6 py-4">{question.tags?.join(', ')}</td>
              <td className="px-6 py-4">
                <button
                  type="button"
                  onClick={() => onTogglePrivacy(question)}
                  className="text-xs text-slate-300 hover:text-primary"
                >
                  {question.is_private ? 'Private' : 'Open'}
                </button>
              </td>
              <td className="px-6 py-4 text-xs text-slate-400">{fromNow(question.updated_at)}</td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(question)}>
                    Edit
                  </Button>
                  {isModerator && (
                    <Button variant="ghost" size="sm" onClick={() => onDelete(question)}>
                      Delete
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
