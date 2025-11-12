import { forwardRef } from 'react';
import { cn } from '../../utils/cn.js';

export const Textarea = forwardRef(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        'w-full min-h-[120px] rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-foreground placeholder:text-slate-400 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/40',
        className
      )}
      {...props}
    />
  );
});
