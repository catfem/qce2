import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card.jsx';
import { Button } from '../ui/Button.jsx';
import { Input } from '../ui/Input.jsx';
import { Badge } from '../ui/Badge.jsx';

export function QuestionSetManager({ sets, onCreate, onMerge, onDuplicate, onExport, onShare, isModerator }) {
  const [newSetName, setNewSetName] = useState('');
  const [targetSet, setTargetSet] = useState('');
  const [secondarySet, setSecondarySet] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');

  const privateCount = useMemo(() => sets.filter((set) => set.is_private).length, [sets]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Question sets</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm text-slate-200">Workspace contains {sets.length} sets ({privateCount} private).</p>
        </div>
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-wide text-slate-400">Create new set</p>
          <div className="flex flex-wrap gap-3">
            <Input className="flex-1 min-w-[220px]" placeholder="e.g. Semester 1 Mock" value={newSetName} onChange={(event) => setNewSetName(event.target.value)} />
            <Button onClick={() => onCreate({ name: newSetName, is_private: false })} disabled={!newSetName.trim()}>
              Create
            </Button>
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-wide text-slate-400">Merge sets</p>
          <div className="grid gap-3 md:grid-cols-3">
            <select className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-slate-100" value={targetSet} onChange={(event) => setTargetSet(event.target.value)}>
              <option value="">Target set</option>
              {sets.map((set) => (
                <option key={set.id} value={set.id}>
                  {set.name}
                </option>
              ))}
            </select>
            <select className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-slate-100" value={secondarySet} onChange={(event) => setSecondarySet(event.target.value)}>
              <option value="">Source set</option>
              {sets
                .filter((set) => set.id !== targetSet)
                .map((set) => (
                  <option key={set.id} value={set.id}>
                    {set.name}
                  </option>
                ))}
            </select>
            <Button variant="secondary" disabled={!targetSet || !secondarySet} onClick={() => onMerge({ targetSetId: targetSet, sourceSetId: secondarySet })}>
              Merge
            </Button>
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-wide text-slate-400">Share or export</p>
          <div className="flex flex-wrap gap-3">
            <select className="rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-slate-100" value={targetSet} onChange={(event) => setTargetSet(event.target.value)}>
              <option value="">Select set</option>
              {sets.map((set) => (
                <option key={set.id} value={set.id}>
                  {set.name}
                </option>
              ))}
            </select>
            <Button variant="ghost" disabled={!targetSet} onClick={() => onDuplicate({ setId: targetSet })}>
              Duplicate
            </Button>
            <Button variant="ghost" disabled={!targetSet} onClick={() => onExport({ setId: targetSet, format: 'pdf' })}>
              Export PDF
            </Button>
            <Button variant="ghost" disabled={!targetSet} onClick={() => onExport({ setId: targetSet, format: 'csv' })}>
              Export CSV
            </Button>
            <Button variant="ghost" disabled={!targetSet} onClick={() => onExport({ setId: targetSet, format: 'docx' })}>
              Export DOCX
            </Button>
          </div>
          {isModerator && (
            <div className="flex flex-wrap gap-3">
              <Input
                className="flex-1 min-w-[220px]"
                placeholder="Recipient email"
                value={recipientEmail}
                onChange={(event) => setRecipientEmail(event.target.value)}
              />
              <Button disabled={!targetSet || !recipientEmail} onClick={() => onShare({ setId: targetSet, email: recipientEmail })}>
                Share set
              </Button>
            </div>
          )}
        </div>
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-wide text-slate-400">Available sets</p>
          <div className="grid gap-3 md:grid-cols-2">
            {sets.map((set) => (
              <div key={set.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-foreground">{set.name}</h4>
                  <Badge variant={set.is_private ? 'warning' : 'success'}>{set.is_private ? 'Private' : 'Open'}</Badge>
                </div>
                <p className="mt-2 text-xs text-slate-400">{set.question_count} questions</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
