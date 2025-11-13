import { cn } from '../../utils/cn.js';

export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-2 rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={cn(
            'flex-1 rounded-xl px-4 py-2 text-sm font-medium transition-all',
            active === tab.value
              ? 'bg-primary/90 text-white shadow-glass'
              : 'text-slate-300 hover:bg-white/10'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
