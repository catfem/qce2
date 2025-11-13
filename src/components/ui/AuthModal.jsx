import { useState } from 'react';
import { Button } from './Button.jsx';
import { Input } from './Input.jsx';
import { Modal } from './Modal.jsx';
import { useUser } from '../../context/UserContext.jsx';

export function AuthModal({ open, onClose }) {
  const [mode, setMode] = useState('signin'); // 'signin', 'signup', 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { loginWithGoogle, signInWithEmail, signUp, resetPassword } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signin') {
        const result = await signInWithEmail(email, password);
        if (result.success) {
          onClose();
          setEmail('');
          setPassword('');
        }
      } else if (mode === 'signup') {
        const result = await signUp(email, password);
        if (result.success) {
          onClose();
          setEmail('');
          setPassword('');
        }
      } else if (mode === 'forgot') {
        const result = await resetPassword(email);
        if (result.success) {
          onClose();
          setEmail('');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
    onClose();
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setMode('signin');
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
      description={
        mode === 'forgot' 
          ? 'Enter your email address and we\'ll send you a link to reset your password.'
          : 'Access your question bank workspace'
      }
    >
      <div className="space-y-4">
        {/* Google Login Button */}
        <Button
          type="button"
          variant="secondary"
          className="w-full"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-gradient-surface px-2 text-slate-400">Or continue with email</span>
          </div>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {mode !== 'forgot' && (
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                minLength={6}
              />
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Loading...' : mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Email'}
          </Button>
        </form>

        {/* Mode Switching */}
        <div className="text-center text-sm text-slate-300">
          {mode === 'signin' && (
            <>
              Don't have an account?{' '}
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() => setMode('signup')}
              >
                Sign up
              </button>
              <br />
              <button
                type="button"
                className="text-primary hover:underline mt-2"
                onClick={() => setMode('forgot')}
              >
                Forgot password?
              </button>
            </>
          )}
          {mode === 'signup' && (
            <>
              Already have an account?{' '}
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() => setMode('signin')}
              >
                Sign in
              </button>
            </>
          )}
          {mode === 'forgot' && (
            <>
              Remember your password?{' '}
              <button
                type="button"
                className="text-primary hover:underline"
                onClick={() => setMode('signin')}
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}