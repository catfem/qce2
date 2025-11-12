import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useUser } from './UserContext.jsx';
import { apiRequest } from '../services/api.js';
import { toast } from 'sonner';

const CreditContext = createContext(undefined);

export function CreditProvider({ children }) {
  const { accessToken, user, role } = useUser();
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCredits = useCallback(async () => {
    if (!accessToken || !user) return;
    setLoading(true);
    try {
      const result = await apiRequest('/credits/getCredits', {
        method: 'POST',
        token: accessToken
      });
      setCredits(result.credits);
    } catch (error) {
      toast.error('Unable to retrieve credits', { description: error.message });
    } finally {
      setLoading(false);
    }
  }, [accessToken, user]);

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  const deductCredits = useCallback(
    async (amount, metadata) => {
      if (!accessToken || !user) return false;
      if (role === 'admin') return true;
      if (credits < amount) {
        toast.warning('Insufficient credits');
        return false;
      }
      try {
        await apiRequest('/credits/deductCredits', {
          method: 'POST',
          token: accessToken,
          body: {
            amount,
            metadata
          }
        });
        setCredits((prev) => Math.max(prev - amount, 0));
        return true;
      } catch (error) {
        toast.error('Credit deduction failed', { description: error.message });
        return false;
      }
    },
    [accessToken, user, role, credits]
  );

  const value = useMemo(
    () => ({
      credits,
      loading,
      fetchCredits,
      deductCredits,
      unlimited: role === 'admin'
    }),
    [credits, loading, fetchCredits, deductCredits, role]
  );

  return <CreditContext.Provider value={value}>{children}</CreditContext.Provider>;
}

export function useCredits() {
  const context = useContext(CreditContext);
  if (!context) {
    throw new Error('useCredits must be used within a CreditProvider');
  }
  return context;
}
