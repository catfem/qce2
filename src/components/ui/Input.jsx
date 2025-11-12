import { forwardRef } from 'react';
import { cn } from '../../utils/cn.js';

export const Input = forwardRef(function Input({ className, type = 'text', ...props }, ref) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        'w-full rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-foreground placeholder:text-slate-400 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/40',
        className
      )}
      {...props}
    />
  );
});
