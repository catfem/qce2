import { AnimatePresence, motion } from 'framer-motion';
import { Button } from './Button.jsx';
import { cn } from '../../utils/cn.js';

export function Modal({ open, onClose, title, description, children, footer }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', mass: 0.8 }}
            className="w-full max-w-2xl rounded-3xl border border-white/5 bg-gradient-surface p-8 shadow-card"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-semibold text-gradient">{title}</h3>
                {description && <p className="mt-1 text-sm text-slate-300">{description}</p>}
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close dialog">
                ✕
              </Button>
            </div>
            <div className="mt-6 space-y-4">{children}</div>
            {footer && <div className={cn('mt-8 flex justify-end gap-3')}>{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
