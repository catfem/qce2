import { motion } from 'framer-motion';
import { cn } from '../../utils/cn.js';

export function Switch({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full border border-white/10 bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
        checked ? 'bg-primary/80' : 'bg-white/10',
        disabled && 'cursor-not-allowed opacity-50'
      )}
      aria-pressed={checked}
      disabled={disabled}
    >
      <motion.span
        layout
        className="inline-block h-5 w-5 rounded-full bg-white shadow"
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  );
}
