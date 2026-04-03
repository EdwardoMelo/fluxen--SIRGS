import React from 'react';
import { createPortal } from 'react-dom';
import { Box, Typography, Paper } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useSystemAnnouncement } from '../hooks/useSystemAnnouncement';
import SystemAnnouncementCard from './SystemAnnouncementCard';
import type { RootState } from '../redux/store';

/**
 * Rotas que antes usavam ContingencyBlocker como wrapper — mantém o mesmo escopo de bloqueio.
 */
function isContingencyProtectedPath(pathname: string): boolean {
  if (pathname === '/equipamentos' || pathname.startsWith('/equipamentos/')) return true;
  if (pathname === '/clientes' || pathname.startsWith('/clientes/')) return true;
  if (pathname === '/metricas' || pathname.startsWith('/metricas/')) return true;
  if (pathname === '/suporte' || pathname.startsWith('/suporte/')) return true;
  return false;
}

/**
 * Bloqueio de contingência fora da árvore das páginas (portal em document.body).
 * Assim atualizações do contexto de anúncios não trocam o "pai" das rotas e não remontam telas.
 */
const ContingencyPortal: React.FC = () => {
  const { pathname } = useLocation();
  const { activeAnnouncement, isContingency } = useSystemAnnouncement();
  const { user } = useSelector((state: RootState) => state.user);

  const isAdmin = user?.perfil_nome === 'ADM';

  if (isAdmin || !isContingency || !activeAnnouncement || !isContingencyProtectedPath(pathname)) {
    return null;
  }

  return createPortal(
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: (theme) => theme.zIndex.modal + 2,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'grey.50',
        p: 3,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'auto',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          maxWidth: 800,
          width: '100%',
        }}
      >
        <SystemAnnouncementCard announcement={activeAnnouncement} fullWidth />
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            O acesso a esta área está temporariamente bloqueado devido a uma contingência no sistema.
          </Typography>
        </Box>
      </Paper>
    </Box>,
    document.body
  );
};

export default ContingencyPortal;
