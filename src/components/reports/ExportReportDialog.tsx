import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Alert,
  CircularProgress,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import ReportService from '../../services/reportService';
import MetricaService from '../../services/metricaService';
import { setFeedback } from '../../redux/slices/feedBackSlice';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import type { Metrica } from '../../types/Metrica';

const PDF_MAX_COLUMNS = 8;

interface ExportReportDialogProps {
  open: boolean;
  onClose: () => void;
  equipamentoId: number;
  equipamentoNome: string;
}

const ExportReportDialog: React.FC<ExportReportDialogProps> = ({
  open,
  onClose,
  equipamentoId,
  equipamentoNome,
}) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
  const [startDate, setStartDate] = useState<Date | null>(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [format, setFormat] = useState<'xlsx' | 'pdf'>('xlsx');
  const [email, setEmail] = useState<string>(user?.email || '');
  const [metrics, setMetrics] = useState<Metrica[]>([]);
  const [selectedMetricIds, setSelectedMetricIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMetrics, setLoadingMetrics] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    const fetchMetrics = async () => {
      setLoadingMetrics(true);
      try {
        const equipamentoMetrics = await MetricaService.getMetricaByEquipamentoId(equipamentoId);
        setMetrics(equipamentoMetrics);
        setSelectedMetricIds(equipamentoMetrics.slice(0, PDF_MAX_COLUMNS).map((metric) => metric.id));
      } catch {
        dispatch(
          setFeedback({
            message: 'Erro ao carregar métricas do equipamento',
            type: 'error',
          })
        );
      } finally {
        setLoadingMetrics(false);
      }
    };

    void fetchMetrics();
  }, [open, equipamentoId, dispatch]);

  const handleMetricToggle = (metricId: number) => {
    setSelectedMetricIds((prev) => {
      if (prev.includes(metricId)) {
        return prev.filter((id) => id !== metricId);
      }
      if (prev.length >= PDF_MAX_COLUMNS) {
        return prev;
      }
      return [...prev, metricId];
    });
  };

  const handleFormatChange = (newFormat: 'xlsx' | 'pdf') => {
    setFormat(newFormat);
    if (newFormat === 'pdf' && selectedMetricIds.length === 0 && metrics.length > 0) {
      setSelectedMetricIds(metrics.slice(0, PDF_MAX_COLUMNS).map((metric) => metric.id));
    }
  };

  const handleSubmit = async () => {
    setError(null);

    if (!startDate || !endDate) {
      setError('Selecione as datas de início e fim');
      return;
    }

    if (startDate > endDate) {
      setError('Data inicial deve ser anterior à data final');
      return;
    }

    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff > 30) {
      setError('Intervalo máximo permitido é de 30 dias');
      return;
    }

    if (daysDiff < 0) {
      setError('Intervalo inválido');
      return;
    }

    if (!email || !email.includes('@')) {
      setError('Email inválido');
      return;
    }

    if (format === 'pdf') {
      if (selectedMetricIds.length === 0) {
        setError('Selecione ao menos uma coluna para o PDF');
        return;
      }
      if (selectedMetricIds.length > PDF_MAX_COLUMNS) {
        setError(`Selecione no máximo ${PDF_MAX_COLUMNS} colunas para o PDF`);
        return;
      }
    }

    setLoading(true);

    try {
      const response = await ReportService.requestReport(equipamentoId, {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        format,
        email: email || undefined,
        ...(format === 'pdf' ? { metricIds: selectedMetricIds } : {}),
      });

      dispatch(
        setFeedback({
          message: response.message || 'Relatório em processamento. Você receberá por email quando estiver pronto.',
          type: 'success',
        })
      );
      onClose();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        'Erro ao solicitar relatório. Tente novamente.';
      setError(errorMessage);
      dispatch(
        setFeedback({
          message: errorMessage,
          type: 'error',
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError(null);
      onClose();
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Exportar Relatório</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Equipamento: <strong>{equipamentoNome}</strong>
            </Typography>

            {error && (
              <Alert severity="error" onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            <DatePicker
              label="Data Inicial"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              maxDate={endDate || undefined}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                },
              }}
            />

            <DatePicker
              label="Data Final"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              minDate={startDate || undefined}
              maxDate={new Date()}
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                },
              }}
            />

            <FormControl fullWidth required>
              <InputLabel>Formato</InputLabel>
              <Select
                value={format}
                label="Formato"
                onChange={(e) => handleFormatChange(e.target.value as 'xlsx' | 'pdf')}
              >
                <MenuItem value="xlsx">Excel (XLSX)</MenuItem>
                <MenuItem value="pdf">PDF</MenuItem>
              </Select>
            </FormControl>

            {format === 'pdf' && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Colunas do PDF ({selectedMetricIds.length}/{PDF_MAX_COLUMNS})
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                  Selecione até {PDF_MAX_COLUMNS} métricas. O PDF será gerado em orientação paisagem.
                </Typography>
                {loadingMetrics ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                ) : metrics.length === 0 ? (
                  <Alert severity="warning">Nenhuma métrica associada a este equipamento.</Alert>
                ) : (
                  <FormGroup sx={{ maxHeight: 220, overflowY: 'auto' }}>
                    {metrics.map((metric) => {
                      const checked = selectedMetricIds.includes(metric.id);
                      const disabled = !checked && selectedMetricIds.length >= PDF_MAX_COLUMNS;
                      return (
                        <FormControlLabel
                          key={metric.id}
                          control={
                            <Checkbox
                              checked={checked}
                              onChange={() => handleMetricToggle(metric.id)}
                              disabled={disabled}
                            />
                          }
                          label={`${metric.nome} (${metric.unidade})`}
                        />
                      );
                    })}
                  </FormGroup>
                )}
              </Box>
            )}

            <TextField
              label="Email (opcional)"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              helperText="Se não informado, será usado o email cadastrado no seu perfil"
              placeholder={user?.email || 'seu@email.com'}
            />

            <Alert severity="info">
              O relatório será processado e enviado por email. O tempo estimado depende do
              tamanho do intervalo selecionado.
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading || !startDate || !endDate || (format === 'pdf' && selectedMetricIds.length === 0)}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Processando...' : 'Solicitar Relatório'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default ExportReportDialog;
