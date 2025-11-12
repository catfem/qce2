import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card.jsx';
import { Progress } from '../ui/Progress.jsx';

export function UsageAnalytics({ usage }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI utilisation</CardTitle>
        <CardDescription>Actions executed via Gemini in the past 30 days</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <p className="text-4xl font-semibold text-gradient">{usage.extractions}</p>
            <p className="text-sm text-slate-300">AI extractions</p>
          </div>
          <div>
            <p className="text-4xl font-semibold text-gradient">{usage.reviews}</p>
            <p className="text-sm text-slate-300">Moderator reviews</p>
          </div>
        </div>
        <div className="space-y-4">
          {usage.breakdown.map((entry) => (
            <div key={entry.label} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-200">{entry.label}</span>
                <span className="text-slate-400">{entry.value}%</span>
              </div>
              <Progress value={entry.value} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
