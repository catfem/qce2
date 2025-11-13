import { useEffect, useState } from 'react';
import { Modal } from '../ui/Modal.jsx';
import { Input } from '../ui/Input.jsx';
import { Textarea } from '../ui/Textarea.jsx';
import { Switch } from '../ui/Switch.jsx';
import { Button } from '../ui/Button.jsx';
import { QUESTION_CATEGORIES, QUESTION_DIFFICULTY } from '../../utils/constants.js';

export function QuestionReviewModal({ open, onClose, data, onSave }) {
  const [localQuestions, setLocalQuestions] = useState([]);
  const [questionSetName, setQuestionSetName] = useState('AI Extracted Set');
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    if (open && data?.questions) {
      setLocalQuestions(data.questions);
      setQuestionSetName(data?.metadata?.suggestedSetName || 'AI Extracted Set');
      setIsPrivate(data?.metadata?.isPrivate ?? false);
    }
  }, [open, data]);

  const updateQuestion = (index, patch) => {
    setLocalQuestions((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...patch };
      return copy;
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Review extracted questions"
      description="Edit AI-generated content before committing it to your question bank."
      footer={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3 text-sm text-slate-200">
            <Switch checked={isPrivate} onChange={setIsPrivate} />
            <span>{isPrivate ? 'Save as private set' : 'Publish as open set'}</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={() => onSave({ questions: localQuestions, meta: { questionSetName, isPrivate } })}>
              Save {localQuestions.length} questions
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <label className="text-xs uppercase tracking-widest text-slate-400">Question set name</label>
          <Input value={questionSetName} onChange={(event) => setQuestionSetName(event.target.value)} />
        </div>
        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
          {localQuestions.map((question, index) => (
            <div key={question.id || index} className="rounded-3xl border border-white/5 bg-white/5 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm uppercase tracking-wide text-slate-400">Question {index + 1}</p>
              </div>
              <div className="mt-3 space-y-4">
                <Input
                  value={question.title}
                  onChange={(event) => updateQuestion(index, { title: event.target.value })}
                  placeholder="Question title"
                />
                <Textarea
                  value={question.body}
                  onChange={(event) => updateQuestion(index, { body: event.target.value })}
                  placeholder="Question prompt"
                />
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-xs uppercase tracking-wide text-slate-400">Difficulty</label>
                    <select
                      className="mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-slate-100"
                      value={question.difficulty}
                      onChange={(event) => updateQuestion(index, { difficulty: event.target.value })}
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
                      value={question.category}
                      onChange={(event) => updateQuestion(index, { category: event.target.value })}
                    >
                      {QUESTION_CATEGORIES.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <Textarea
                  value={question.explanation || ''}
                  onChange={(event) => updateQuestion(index, { explanation: event.target.value })}
                  placeholder="Explanation"
                />
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-wide text-slate-400">Options</p>
                  {(question.options || []).map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center gap-3">
                      <Input
                        value={option.value}
                        onChange={(event) => {
                          const options = [...(question.options || [])];
                          options[optionIndex] = { ...options[optionIndex], value: event.target.value };
                          updateQuestion(index, { options });
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const options = [...(question.options || [])];
                          options[optionIndex] = { ...options[optionIndex], isCorrect: !option.isCorrect };
                          updateQuestion(index, { options });
                        }}
                        className={option.isCorrect ? 'text-emerald-300' : 'text-slate-400'}
                      >
                        {option.isCorrect ? 'Correct' : 'Mark correct'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
