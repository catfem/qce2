import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card.jsx';
import { Badge } from '../ui/Badge.jsx';
import { cn } from '../../utils/cn.js';

const colors = ['from-indigo-500 to-sky-500', 'from-emerald-500 to-teal-500', 'from-amber-500 to-rose-500'];

export function StatsCards({ stats = [] }) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {stats.map((item, index) => (
        <Card key={item.label} className="relative overflow-hidden">
          <div
            className={cn(
              'absolute inset-0 opacity-30 blur-3xl',
              `bg-gradient-to-br ${colors[index % colors.length]}`
            )}
            aria-hidden="true"
          />
          <CardHeader>
            <CardTitle>{item.value}</CardTitle>
            <CardDescription>{item.label}</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant={item.trend >= 0 ? 'success' : 'warning'}>
              {item.trend >= 0 ? '+' : ''}
              {item.trend}% vs last 30 days
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
