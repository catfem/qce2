import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card.jsx';
import { Badge } from '../ui/Badge.jsx';
import { fromNow } from '../../utils/formatters.js';

export function RecentActivity({ items = [] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
        <CardDescription>Latest uploads, AI extractions, and moderation events</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.length === 0 && <p className="text-sm text-slate-300">No activity recorded yet.</p>}
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div>
              <p className="text-sm font-medium text-foreground">{item.title}</p>
              <p className="text-xs text-slate-400">{fromNow(item.created_at)}</p>
            </div>
            <Badge variant={item.type === 'ai' ? 'success' : item.type === 'moderation' ? 'warning' : 'default'}>
              {item.type}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
