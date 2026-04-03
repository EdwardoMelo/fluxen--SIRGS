import React, {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import SystemAnnouncementService from '../services/systemAnnouncementService';
import type { SystemAnnouncement } from '../types/SystemAnnouncement';

type SystemAnnouncementContextValue = {
  activeAnnouncement: SystemAnnouncement | null;
  loading: boolean;
  error: string | null;
  isContingency: boolean;
  hasActiveAnnouncement: boolean;
  refetch: () => Promise<void>;
};

const SystemAnnouncementContext = createContext<SystemAnnouncementContextValue | null>(null);

export const SystemAnnouncementProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeAnnouncement, setActiveAnnouncement] = useState<SystemAnnouncement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActiveAnnouncement = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const announcement = await SystemAnnouncementService.getActiveAnnouncement();
      setActiveAnnouncement(announcement);
    } catch (err: any) {
      setError(err?.message || 'Erro ao buscar anúncio ativo');
      setActiveAnnouncement(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveAnnouncement();

    const interval = setInterval(fetchActiveAnnouncement, 30000);

    return () => clearInterval(interval);
  }, [fetchActiveAnnouncement]);

  const value = useMemo<SystemAnnouncementContextValue>(
    () => ({
      activeAnnouncement,
      loading,
      error,
      isContingency: activeAnnouncement?.type === 'CONTINGENCY',
      hasActiveAnnouncement: activeAnnouncement !== null,
      refetch: fetchActiveAnnouncement,
    }),
    [activeAnnouncement, loading, error, fetchActiveAnnouncement]
  );

  return createElement(SystemAnnouncementContext.Provider, { value }, children);
};

export const useSystemAnnouncement = (): SystemAnnouncementContextValue => {
  const ctx = useContext(SystemAnnouncementContext);
  if (!ctx) {
    throw new Error('useSystemAnnouncement must be used within SystemAnnouncementProvider');
  }
  return ctx;
};
