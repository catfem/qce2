import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card.jsx';
import { Button } from '../components/ui/Button.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { useUser } from '../context/UserContext.jsx';
import { useCredits } from '../context/CreditContext.jsx';
import { fetchWorkspaceUsers, updateUserRole } from '../services/admin.js';
import { allocateCredits, fetchCreditLedger } from '../services/credits.js';
import { ROLES } from '../utils/constants.js';

const roleOptions = [
  { label: 'Level 1 · User', value: ROLES.user },
  { label: 'Level 2 · Moderator', value: ROLES.moderator },
  { label: 'Level 3 · Admin', value: ROLES.admin }
];

export default function SettingsPage() {
  const { profile, role, accessToken } = useUser();
  const { credits, unlimited } = useCredits();
  const queryClient = useQueryClient();

  const [selectedUser, setSelectedUser] = useState('');
  const [creditAmount, setCreditAmount] = useState(10);
  const [roleValue, setRoleValue] = useState(ROLES.user);

  const isAdmin = useMemo(() => role === ROLES.admin, [role]);

  const { data: users } = useQuery({
    queryKey: ['workspace-users'],
    queryFn: () => fetchWorkspaceUsers(accessToken),
    enabled: isAdmin
  });

  const { data: ledgerData } = useQuery({
    queryKey: ['credit-ledger'],
    queryFn: () => fetchCreditLedger(accessToken),
    enabled: isAdmin
  });

  const allocateMutation = useMutation({
    mutationFn: (payload) => allocateCredits(accessToken, payload),
    onSuccess: async () => {
      toast.success('Credits updated');
      setCreditAmount(10);
      await Promise.all([queryClient.invalidateQueries(['credit-ledger']), queryClient.invalidateQueries(['dashboard-overview'])]);
    },
    onError: (error) => toast.error('Failed to update credits', { description: error.message })
  });

  const updateRoleMutation = useMutation({
    mutationFn: (payload) => updateUserRole(accessToken, payload),
    onSuccess: async () => {
      toast.success('Role updated');
      await queryClient.invalidateQueries(['workspace-users']);
    },
    onError: (error) => toast.error('Failed to update role', { description: error.message })
  });

  const handleAllocate = () => {
    if (!selectedUser) return;
    allocateMutation.mutate({ userId: selectedUser, amount: Number(creditAmount) });
  };

  const handleRoleUpdate = () => {
    if (!selectedUser) return;
    updateRoleMutation.mutate({ userId: selectedUser, role: roleValue });
  };

  const ledger = ledgerData?.entries || [];

  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-3xl font-semibold text-gradient">Settings</h2>
        <p className="text-sm text-slate-300">Configure your account, AI usage policies, storage buckets, and team permissions.</p>
      </section>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-200">
            <div className="flex items-center justify-between">
              <span>Email</span>
              <span>{profile?.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Role</span>
              <Badge>{role.toUpperCase()}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Credits</span>
              <span>{unlimited ? 'Unlimited' : credits}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>AI configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-200">
            <p>
              Gemini requests are proxied via Cloudflare Workers. Ensure <code>GEMINI_API_KEY</code> is added to the Pages project
              environment variables. Rate limits are enforced server-side using Supabase audit logs.
            </p>
            <p>
              Extraction defaults to {DEFAULT_AI_EXTRACTION_COST} credits per batch. Moderators can trigger reviews which cost 2 credits each.
            </p>
            <p>Uploads are staged in Supabase Storage. Update <code>VITE_SUPABASE_STORAGE_BUCKET</code> to reconfigure buckets.</p>
          </CardContent>
        </Card>
      </div>
      {isAdmin && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Credit management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <select
                className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-slate-100"
                value={selectedUser}
                onChange={(event) => setSelectedUser(event.target.value)}
              >
                <option value="">Select member</option>
                {(users?.items || []).map((userItem) => (
                  <option key={userItem.id} value={userItem.id}>
                    {userItem.email} · {userItem.role}
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-3">
                <Input type="number" value={creditAmount} onChange={(event) => setCreditAmount(event.target.value)} />
                <Button onClick={handleAllocate} disabled={!selectedUser || allocateMutation.isPending}>
                  Allocate credits
                </Button>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-400">Ledger</p>
                <div className="mt-3 max-h-48 space-y-2 overflow-y-auto pr-1">
                  {ledger.length === 0 && <p className="text-xs text-slate-400">No credit history yet.</p>}
                  {ledger.map((entry) => (
                    <div key={entry.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs">
                      <span>{entry.reason}</span>
                      <span className={entry.amount >= 0 ? 'text-emerald-300' : 'text-rose-300'}>
                        {entry.amount >= 0 ? '+' : ''}
                        {entry.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Role management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <select
                className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-slate-100"
                value={selectedUser}
                onChange={(event) => setSelectedUser(event.target.value)}
              >
                <option value="">Select member</option>
                {(users?.items || []).map((userItem) => (
                  <option key={userItem.id} value={userItem.id}>
                    {userItem.email} · {userItem.role}
                  </option>
                ))}
              </select>
              <select
                className="w-full rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-slate-100"
                value={roleValue}
                onChange={(event) => setRoleValue(event.target.value)}
              >
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Button onClick={handleRoleUpdate} disabled={!selectedUser || updateRoleMutation.isPending}>
                Update role
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
