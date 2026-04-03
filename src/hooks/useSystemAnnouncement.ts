import type { SystemAnnouncement } from '../types/SystemAnnouncement';

export type SystemAnnouncementContextValue = {
  activeAnnouncement: SystemAnnouncement | null;
  loading: boolean;
  error: string | null;
  isContingency: boolean;
  hasActiveAnnouncement: boolean;
  refetch: () => Promise<void>;
};

const disabledState: SystemAnnouncementContextValue = {
  activeAnnouncement: null,
  loading: false,
  error: null,
  isContingency: false,
  hasActiveAnnouncement: false,
  refetch: async () => {},
};

/**
 * System announcement polling is disabled to avoid wrapping the app in a provider
 * that re-renders the tree on interval updates. Restore active announcements by
 * reintroducing context + fetch/poll in this module and SystemAnnouncementProvider in App.
 */
export const useSystemAnnouncement = (): SystemAnnouncementContextValue => disabledState;
