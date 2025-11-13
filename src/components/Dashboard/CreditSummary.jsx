import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card.jsx';
import { Badge } from '../ui/Badge.jsx';

export function CreditSummary({ credits, ledger, unlimited }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Credit overview</CardTitle>
        <CardDescription>Usage history for your workspace</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div>
            <p className="text-3xl font-semibold text-gradient">{unlimited ? 'Unlimited' : credits}</p>
            <p className="text-xs uppercase tracking-wide text-slate-400">Available credits</p>
          </div>
          <Badge>{unlimited ? 'Admin' : 'Metered usage'}</Badge>
        </div>
        <div className="space-y-3">
          {ledger.length === 0 && <p className="text-sm text-slate-300">No credit events recorded.</p>}
          {ledger.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-background/60 px-4 py-3 text-sm">
              <div className="flex flex-col">
                <span className="font-medium text-foreground">{entry.reason}</span>
                <span className="text-xs text-slate-400">{new Date(entry.created_at).toLocaleString()}</span>
              </div>
              <span className={entry.amount >= 0 ? 'text-emerald-300' : 'text-rose-300'}>
                {entry.amount >= 0 ? '+' : ''}
                {entry.amount}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
