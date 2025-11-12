import { cn } from '../../utils/cn.js';

export function Card({ className, children }) {
  return <div className={cn('glass-panel p-6', className)}>{children}</div>;
}

export function CardHeader({ className, children }) {
  return <div className={cn('mb-4 flex flex-col gap-2', className)}>{children}</div>;
}

export function CardTitle({ className, children }) {
  return <h3 className={cn('text-xl font-semibold tracking-tight text-gradient', className)}>{children}</h3>;
}

export function CardDescription({ className, children }) {
  return <p className={cn('text-sm text-slate-300', className)}>{children}</p>;
}

export function CardContent({ className, children }) {
  return <div className={cn('space-y-4', className)}>{children}</div>;
}

export function CardFooter({ className, children }) {
  return <div className={cn('mt-6 flex items-center justify-end gap-3', className)}>{children}</div>;
}
