import { cn } from '../../utils/cn.js';

export function Badge({ className, children, variant = 'default' }) {
  const styles = {
    default: 'bg-white/10 text-foreground backdrop-blur px-2.5 py-1 rounded-full border border-white/10',
    success: 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30',
    warning: 'bg-amber-500/20 text-amber-200 border border-amber-500/30',
    danger: 'bg-red-500/20 text-red-200 border border-red-500/30'
  };
  return (
    <span className={cn('text-xs font-medium uppercase tracking-wide', styles[variant], className)}>{children}</span>
  );
}
