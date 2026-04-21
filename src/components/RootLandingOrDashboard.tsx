import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { Box, Typography, CircularProgress } from '@mui/material';
import HomePage from '../pages/HomePage';

/**
 * Rota "/": visitantes vão para a landing (/index); usuários com sessão válida veem o dashboard.
 */
const RootLandingOrDashboard: React.FC = () => {
  const { user, isAuthChecking } = useSelector((state: RootState) => state.user);

  if (isAuthChecking) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          gap: 2,
        }}
      >
        <CircularProgress size={60} />
        <Typography variant="h6" color="text.secondary">
          Verificando autenticação...
        </Typography>
      </Box>
    );
  }

  if (!user) {
    return <Navigate to="/index" replace />;
  }

  return <HomePage />;
};

export default RootLandingOrDashboard;
