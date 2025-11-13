import { useEffect, useState } from 'react';
import { Modal } from '../ui/Modal.jsx';
import { Input } from '../ui/Input.jsx';
import { Textarea } from '../ui/Textarea.jsx';
import { Switch } from '../ui/Switch.jsx';
import { Button } from '../ui/Button.jsx';
import { QUESTION_CATEGORIES, QUESTION_DIFFICULTY } from '../../utils/constants.js';

export function QuestionEditorModal({ open, question, onClose, onSubmit }) {
  const [draft, setDraft] = useState(question);

  useEffect(() => {
    if (open) setDraft(question);
  }, [open, question]);

  if (!draft) return null;

  const update = (patch) => setDraft({ ...draft, ...patch });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit question"
      description="Update metadata, privacy, and content. Moderators can update any question, while authors can adjust their own."
      footer={
        <div className="flex items-center gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSubmit(draft)}>Save changes</Button>
        </div>
      }
    >
      <div className="space-y-5">
        <Input value={draft.title} onChange={(event) => update({ title: event.target.value })} />
        <Textarea value={draft.body} onChange={(event) => update({ body: event.target.value })} />
        <Textarea
          value={draft.explanation || ''}
          placeholder="Explanation"
          onChange={(event) => update({ explanation: event.target.value })}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-wide text-slate-400">Difficulty</label>
            <select
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-slate-100"
              value={draft.difficulty}
              onChange={(event) => update({ difficulty: event.target.value })}
            >
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
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-slate-100"
              value={draft.category}
              onChange={(event) => update({ category: event.target.value })}
            >
              {QUESTION_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={draft.is_private} onChange={(value) => update({ is_private: value })} />
          <span className="text-sm text-slate-200">{draft.is_private ? 'Private' : 'Open for everyone'}</span>
        </div>
      </div>
    </Modal>
  );
}
