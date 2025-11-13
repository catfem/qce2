import { cva } from 'class-variance-authority';
import { cn } from '../../utils/cn.js';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/70 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-glass hover:bg-primary/90',
        secondary: 'bg-white/10 text-foreground hover:bg-white/20 border border-white/10',
        ghost: 'text-foreground hover:bg-white/10',
        destructive: 'bg-red-500 text-white hover:bg-red-600'
      },
      size: {
        default: 'h-11 px-6',
        sm: 'h-9 px-4 text-sm',
        lg: 'h-12 px-8 text-lg',
        icon: 'h-10 w-10 p-0'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

export function Button({ className, variant, size, ...props }) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { buttonVariants };
