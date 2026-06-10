import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import EquipamentoService from '../services/equipamentoService';
import type { EquipamentoOnlineStatus } from '../types/Equipamento';

/** Intervalo de polling de status no dashboard (1 req por equipamento único). */
export const DASHBOARD_ONLINE_STATUS_POLL_MS = 30_000;

function buildUniqueIdsKey(equipamentoIds: number[]): string {
  return [...new Set(equipamentoIds.filter((id) => Number.isInteger(id) && id > 0))]
    .sort((a, b) => a - b)
    .join(',');
}

function parseUniqueIdsKey(key: string): number[] {
  if (!key) return [];
  return key.split(',').map(Number).filter((id) => Number.isInteger(id) && id > 0);
}

export function useDashboardOnlineStatus(equipamentoIds: number[]) {
  const uniqueIdsKey = useMemo(
    () => buildUniqueIdsKey(equipamentoIds),
    [buildUniqueIdsKey(equipamentoIds)]
  );

  const [statusByEquipamentoId, setStatusByEquipamentoId] = useState<
    Record<number, EquipamentoOnlineStatus>
  >({});

  const inFlightRef = useRef(false);

  const fetchStatusesForIds = useCallback(async (ids: number[]) => {
    if (ids.length === 0) {
      setStatusByEquipamentoId({});
      return;
    }

    if (inFlightRef.current) return;
    inFlightRef.current = true;

    try {
      const results = await Promise.allSettled(
        ids.map(async (id) => {
          const status = await EquipamentoService.getOnlineStatus(id);
          return { id, status };
        })
      );

      setStatusByEquipamentoId((prev) => {
        const next = { ...prev };
        for (const result of results) {
          if (result.status === 'fulfilled') {
            next[result.value.id] = result.value.status;
          }
        }
        return next;
      });
    } finally {
      inFlightRef.current = false;
    }
  }, []);

  useEffect(() => {
    const ids = parseUniqueIdsKey(uniqueIdsKey);

    void fetchStatusesForIds(ids);

    const interval = window.setInterval(() => {
      void fetchStatusesForIds(ids);
    }, DASHBOARD_ONLINE_STATUS_POLL_MS);

    return () => clearInterval(interval);
  }, [uniqueIdsKey, fetchStatusesForIds]);

  const getIsOnline = useCallback(
    (equipamentoId: number): boolean | null => {
      const status = statusByEquipamentoId[equipamentoId];
      if (!status) return null;
      return status.isOnline;
    },
    [statusByEquipamentoId]
  );

  const refreshStatuses = useCallback(() => {
    const ids = parseUniqueIdsKey(uniqueIdsKey);
    return fetchStatusesForIds(ids);
  }, [uniqueIdsKey, fetchStatusesForIds]);

  return {
    statusByEquipamentoId,
    getIsOnline,
    refreshStatuses,
  };
}
