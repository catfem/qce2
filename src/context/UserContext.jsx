import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/auth.js';
import { apiRequest } from '../services/api.js';
import { toast } from 'sonner';

const UserContext = createContext(undefined);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [role, setRole] = useState('user');
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchProfile = useCallback(
    async (token) => {
      const activeToken = token || accessToken;
      if (!activeToken) return;
      const result = await apiRequest('/auth/roleCheck', {
        method: 'POST',
        token: activeToken
      });
      setProfile(result.profile);
      setRole(result.profile.role);
      return result.profile;
    },
    [accessToken]
  );

  useEffect(() => {
    let active = true;
    async function initialise() {
      try {
        const {
          data: { session }
        } = await supabase.auth.getSession();
        if (!active) return;
        if (session?.user) {
          setUser(session.user);
          setAccessToken(session.access_token);
          await fetchProfile(session.access_token);
        }
      } catch (error) {
        toast.error('Unable to initialise session', { description: error.message });
      } finally {
        if (active) setLoading(false);
      }
    }
    initialise();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        setUser(null);
        setAccessToken(null);
        setProfile(null);
        setRole('user');
        setLoading(false);
        return;
      }
      setUser(session.user);
      setAccessToken(session.access_token);
      setLoading(false);
      await fetchProfile(session.access_token);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const loginWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
    if (error) {
      toast.error('Google sign-in failed', { description: error.message });
    }
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setAccessToken(null);
    setProfile(null);
    setRole('user');
    navigate('/');
  }, [navigate]);

  const value = useMemo(
    () => ({
      user,
      profile,
      role,
      accessToken,
      loading,
      loginWithGoogle,
      logout,
      refreshProfile: fetchProfile
    }),
    [user, profile, role, accessToken, loading, loginWithGoogle, logout, fetchProfile]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
