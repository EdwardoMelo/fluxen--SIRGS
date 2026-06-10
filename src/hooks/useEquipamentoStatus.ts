import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import EquipamentoService from '../services/equipamentoService';
import { parseTimestampAsLocal } from '../utils/dateUtils';

interface EquipamentoStatus {
  isOnline: boolean;
  lastLogAt: Date | null;
  isRefreshing: boolean;
  timeoutOnlineSegundos: number;
  effectiveTimeoutSegundos: number;
}

/** `false` desativa polling e chamadas à API de status. */
export const EQUIPAMENTO_STATUS_MONITORING_ENABLED = true;

const STATUS_POLL_INTERVAL_MS = 10_000;

export const useEquipamentoStatus = () => {
  const { id } = useParams();
  const [status, setStatus] = useState<EquipamentoStatus>({
    isOnline: false,
    lastLogAt: null,
    isRefreshing: false,
    timeoutOnlineSegundos: 10,
    effectiveTimeoutSegundos: 20,
  });

  const checkStatus = useCallback(async (isAutoRefresh = false) => {
    if (!id) return;

    setStatus(prev => ({ ...prev, isRefreshing: isAutoRefresh }));

    try {
      const onlineStatus = await EquipamentoService.getOnlineStatus(Number(id));

      setStatus({
        isOnline: onlineStatus.isOnline,
        lastLogAt: onlineStatus.lastLogAt
          ? parseTimestampAsLocal(onlineStatus.lastLogAt)
          : null,
        isRefreshing: false,
        timeoutOnlineSegundos: onlineStatus.timeoutOnlineSegundos,
        effectiveTimeoutSegundos: onlineStatus.effectiveTimeoutSegundos,
      });
    } catch (error) {
      console.error('Erro ao verificar status do equipamento:', error);
      setStatus(prev => ({
        ...prev,
        isRefreshing: false,
        isOnline: false,
      }));
    }
  }, [id]);

  useEffect(() => {
    if (!EQUIPAMENTO_STATUS_MONITORING_ENABLED) return;

    checkStatus();
    const interval = setInterval(() => {
      checkStatus(true);
    }, STATUS_POLL_INTERVAL_MS);
    return () => {
      clearInterval(interval);
    };
  }, [checkStatus]);

  return {
    ...status,
    /** Compatível com OnlineStatusCard (último log recebido). */
    lastUpdate: status.lastLogAt,
    checkStatus,
  };
};
