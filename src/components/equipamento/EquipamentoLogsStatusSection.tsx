import { Box, useMediaQuery, useTheme } from "@mui/material";
import OnlineStatusCard from "../shared/OnlineStatusCard";
import {
  useEquipamentoStatus,
  EQUIPAMENTO_STATUS_MONITORING_ENABLED,
} from "../../hooks/useEquipamentoStatus";

/**
 * Estado de monitoramento de status isolado aqui para que atualizações do hook
 * não re-renderizem a página inteira nem a tabela de logs (irmãos no pai).
 */
const EquipamentoLogsStatusSection = () => {
  const equipamentoStatus = useEquipamentoStatus();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (!EQUIPAMENTO_STATUS_MONITORING_ENABLED) {
    return null;
  }

  return (
    <Box sx={{ mb: isMobile ? 2 : 3 }}>
      <OnlineStatusCard
        isOnline={equipamentoStatus.isOnline}
        lastUpdate={equipamentoStatus.lastUpdate}
        isRefreshing={equipamentoStatus.isRefreshing}
      />
    </Box>
  );
};

export default EquipamentoLogsStatusSection;
