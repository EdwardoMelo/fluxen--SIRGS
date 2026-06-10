import { Box, Typography } from '@mui/material';

interface EquipamentoOnlineIndicatorProps {
  isOnline: boolean | null;
  compact?: boolean;
}

const EquipamentoOnlineIndicator: React.FC<EquipamentoOnlineIndicatorProps> = ({
  isOnline,
  compact = false,
}) => {
  const color =
    isOnline === null ? '#9e9e9e' : isOnline ? '#22c55e' : '#ef4444';
  const label =
    isOnline === null ? 'verificando...' : isOnline ? 'online' : 'offline';

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.5,
        userSelect: 'none',
      }}
      aria-label={`Equipamento ${label}`}
    >
      <Box
        sx={{
          width: compact ? 8 : 10,
          height: compact ? 8 : 10,
          borderRadius: '50%',
          bgcolor: color,
          boxShadow: isOnline
            ? '0 0 0 2px rgba(34, 197, 94, 0.25)'
            : isOnline === false
              ? '0 0 0 2px rgba(239, 68, 68, 0.2)'
              : 'none',
          flexShrink: 0,
        }}
      />
      {!compact && (
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            fontSize: '0.7rem',
            lineHeight: 1,
            textTransform: 'lowercase',
          }}
        >
          {label}
        </Typography>
      )}
    </Box>
  );
};

export default EquipamentoOnlineIndicator;
