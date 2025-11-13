import { motion } from 'framer-motion';
import { cn } from '../../utils/cn.js';

export function Progress({ value = 0, className }) {
  return (
    <div className={cn('h-2 w-full rounded-full bg-white/10', className)}>
      <motion.div
        className="h-full rounded-full bg-primary"
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, value)}%` }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />
    </div>
  );
}
