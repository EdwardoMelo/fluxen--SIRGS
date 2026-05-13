import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import EquipamentoLogService from '../services/equipamentoLogService';

interface EquipamentoStatus {
  isOnline: boolean;
  lastUpdate: Date | null;
  isRefreshing: boolean;
  currentLogCount: number;
}

/** `false` desativa polling e chamadas à API de logs só para status. Reative para voltar o monitoramento. */
export const EQUIPAMENTO_STATUS_MONITORING_ENABLED = true;

export const useEquipamentoStatus = () => {
  const { id } = useParams();
  const [status, setStatus] = useState<EquipamentoStatus>({
    isOnline: false,
    lastUpdate: null,
    isRefreshing: false,
    currentLogCount: 0
  });

  const checkStatus = useCallback(async (isAutoRefresh = false) => {
    if (!id) return;

    setStatus(prev => ({ ...prev, isRefreshing: isAutoRefresh }));

    try {
      const tableData = await EquipamentoLogService.getLogsTableData(Number(id), {
        page: 1,
        pageSize: 5
      });
      const hasLogs = (tableData.rows?.length ?? 0) > 0;
      const now = new Date();

      setStatus(prev => ({
        isOnline: hasLogs,
        lastUpdate: now,
        isRefreshing: false,
        currentLogCount: tableData.rows?.length ?? 0
      }));
    } catch (error) {
      console.error('Erro ao verificar status do equipamento:', error);
      setStatus(prev => ({
        ...prev,
        isRefreshing: false,
        isOnline: false
      }));
    }
  }, [id]);

  useEffect(() => {
    checkStatus();
    const interval = setInterval(() => {
      checkStatus(true);
    }, 10000);
    return () => {
      clearInterval(interval);
    };
  }, [checkStatus]);

  return {
    ...status,
    checkStatus
  };
};
