import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button.jsx';
import { Input } from '../components/ui/Input.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { toast } from 'sonner';
import { supabase } from '../services/auth.js';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const accessToken = searchParams.get('access_token');
  const refreshToken = searchParams.get('refresh_token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        toast.error('Failed to reset password', { description: error.message });
      } else {
        toast.success('Password reset successfully!');
        setTimeout(() => navigate('/'), 2000);
      }
    } catch (error) {
      toast.error('An error occurred', { description: error.message });
    } finally {
      setLoading(false);
    }
  };

  // If no tokens are present, show an error
  if (!accessToken || !refreshToken) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="glass-panel w-full max-w-md px-8 py-8 text-center">
          <Badge className="mx-auto mb-4 w-fit">Error</Badge>
          <h1 className="mb-4 text-2xl font-semibold text-gradient">Invalid Reset Link</h1>
          <p className="mb-6 text-slate-300">
            This password reset link is invalid or has expired. Please request a new one.
          </p>
          <Button onClick={() => navigate('/')}>Return to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md px-6">
        <div className="glass-panel px-8 py-8">
          <div className="text-center">
            <Badge className="mx-auto mb-4 w-fit">Reset Password</Badge>
            <h1 className="mb-2 text-2xl font-semibold text-gradient">Set New Password</h1>
            <p className="mb-6 text-sm text-slate-300">
              Enter your new password below
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            <div>
              <Input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}