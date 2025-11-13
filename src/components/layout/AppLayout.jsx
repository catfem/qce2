import { NavLink, Outlet } from 'react-router-dom';
import { Button } from '../ui/Button.jsx';
import { Badge } from '../ui/Badge.jsx';
import { useUser } from '../../context/UserContext.jsx';
import { useCredits } from '../../context/CreditContext.jsx';
import { cn } from '../../utils/cn.js';
import { ROLES } from '../../utils/constants.js';

const navigation = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Questions', path: '/questions' },
  { label: 'Settings', path: '/settings' }
];

export default function AppLayout() {
  const { profile, role, logout } = useUser();
  const { credits, unlimited } = useCredits();

  return (
    <div className="relative flex min-h-screen bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-gradient-radial" aria-hidden="true" />
      <aside className="relative hidden w-72 flex-col border-r border-white/5 bg-white/5/30 px-6 py-10 backdrop-blur-xl lg:flex">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-widest text-slate-400">Gemini Question Bank</p>
          <h1 className="text-2xl font-semibold text-gradient">Control Center</h1>
        </div>
        <nav className="mt-10 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition-all',
                  isActive ? 'bg-primary/90 text-white shadow-glass' : 'text-slate-300 hover:bg-white/10'
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto space-y-4 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-slate-200">
          <p className="text-xs uppercase tracking-wide text-slate-400">Credits</p>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-semibold text-gradient">{unlimited ? '∞' : credits}</span>
            <Badge variant="success">{role.toUpperCase()}</Badge>
          </div>
          <p className="text-xs text-slate-400">
            {role === ROLES.admin ? 'Admins enjoy unlimited AI usage.' : 'Credits are consumed whenever AI extraction or moderation is performed.'}
          </p>
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-20 border-b border-white/5 bg-background/70 backdrop-blur-lg">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500">Welcome back</p>
              <p className="text-lg font-medium text-gradient">{profile?.display_name || profile?.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
                {role === ROLES.admin ? 'Unlimited credits' : `${credits} credits left`}
              </div>
              <Button variant="secondary" onClick={logout}>
                Sign out
              </Button>
            </div>
          </div>
        </header>
        <main className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-10 lg:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
