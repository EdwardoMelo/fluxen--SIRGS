import { Box, FormControl, MenuItem, Select, Stack, Typography } from '@mui/material'
import React, { useCallback, useEffect } from 'react'
import Input from './shared/Input'
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import EquipamentoService from '../services/equipamentoService';
import { setFeedback } from '../redux/slices/feedBackSlice';
import { BaseButton } from './shared/Button';
import type { RootState } from '../redux/store';
import { addEquipamento, replaceEquipamento, setCreatingEquipamento, setEditingEquipamento } from '../redux/slices/equipamentosTableSlice';
import { useClientOptions } from '../hooks/useClientOptions';
import OptionsField from './shared/OptionsField';
import { BaseCancelButton } from './shared/BaseCancelButton';
import {
  convertToTimeoutSeconds,
  getMaxValueForUnit,
  MAX_TIMEOUT_ONLINE_SEGUNDOS,
  secondsToTimeoutDisplay,
  TIMEOUT_ONLINE_UNIT_OPTIONS,
  type TimeoutOnlineUnit,
} from '../utils/timeoutOnlineUtils';


export interface EquipmentForm {
  nome: string;
  id_cliente?: number;
  timeout_online_segundos?: number | null;
}

interface EquipamentoFormProps {
  disabled?: boolean;
}

const EquipamentoForm: React.FC<EquipamentoFormProps> = ({ disabled = false }) => {
  const dispatch = useDispatch();
  const {id} = useParams();
  const [formData, setFormData] = React.useState<EquipmentForm>({
    nome: '',
  });
  const [timeoutValue, setTimeoutValue] = React.useState<number | ''>('');
  const [timeoutUnit, setTimeoutUnit] = React.useState<TimeoutOnlineUnit>('segundos');
  const [validationErrors, setValidationErrors] = React.useState<Record<string, string>>({});
  const [equipamentoId, setEquipamentoId] = React.useState<number | null>(null);
  const editingEquipamento = useSelector((state: RootState) => state.equipamentosTable.editingEquipamento);
  const {clientOptions } = useClientOptions();

  const fields = [
    { label: 'Equipamento', name: 'nome' },
  ];
  const optionFields = [
    { label: 'Cliente', name: 'id_cliente' },
  ];

  const buildPayload = (): EquipmentForm => {
    const timeoutSeconds =
      timeoutValue === '' || timeoutValue === null
        ? null
        : convertToTimeoutSeconds(Number(timeoutValue), timeoutUnit);

    return {
      ...formData,
      timeout_online_segundos: timeoutSeconds,
    };
  };

  const resetFormData = () => {
    fetchDataCallback();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const limitedValue = name === 'nome' && value.length > 28 ? value.slice(0, 28) : value;
    setFormData((prevData) => ({
      ...prevData,
      [name]: limitedValue,
    }));

    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleTimeoutValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setTimeoutValue(raw === '' ? '' : Number(raw));

    if (validationErrors.timeout_online) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.timeout_online;
        return newErrors;
      });
    }
  };

  const handleTimeoutUnitChange = (unit: TimeoutOnlineUnit) => {
    setTimeoutUnit(unit);

    if (validationErrors.timeout_online) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.timeout_online;
        return newErrors;
      });
    }
  };

  const handleClientChange = (value: string | number) => {
    setFormData({ ...formData, id_cliente: value ? Number(value) : undefined });

    if (validationErrors.id_cliente) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.id_cliente;
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.nome || formData.nome.trim() === '') {
      errors.nome = 'Nome do equipamento é obrigatório';
    } else if (formData.nome.length > 28) {
      errors.nome = 'Nome do equipamento deve ter no máximo 28 caracteres';
    }

    if (!id && !equipamentoId) {
      if (!formData.id_cliente) {
        errors.id_cliente = 'Cliente é obrigatório';
      }
    }

    if (timeoutValue !== '' && timeoutValue !== null) {
      if (!Number.isInteger(timeoutValue) || timeoutValue < 1) {
        errors.timeout_online = 'Informe um valor inteiro maior que zero';
      } else {
        const timeoutSeconds = convertToTimeoutSeconds(timeoutValue, timeoutUnit);
        const maxForUnit = getMaxValueForUnit(timeoutUnit);

        if (timeoutValue > maxForUnit) {
          errors.timeout_online = `Máximo de ${maxForUnit} ${timeoutUnit} (${MAX_TIMEOUT_ONLINE_SEGUNDOS}s)`;
        } else if (timeoutSeconds > MAX_TIMEOUT_ONLINE_SEGUNDOS) {
          errors.timeout_online = `Valor máximo permitido é ${MAX_TIMEOUT_ONLINE_SEGUNDOS} segundos (24h)`;
        }
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      dispatch(
        setFeedback({
          message: "Por favor, preencha todos os campos obrigatórios",
          type: "error",
        })
      );
      return;
    }

    const payload = buildPayload();

    try {
      if (equipamentoId) {
        const updatedEquip = await EquipamentoService.updateEquipamento(
          Number(equipamentoId),
          payload
        );
        dispatch(replaceEquipamento(updatedEquip));
        dispatch(setEditingEquipamento(null));
        dispatch(
          setFeedback({
            message: "Equipamento atualizado com sucesso",
            type: "success",
          })
        );
        return;
      }

      const newEquip = await EquipamentoService.createEquipamento(payload);
      dispatch(addEquipamento(newEquip));
      dispatch(setCreatingEquipamento(false));
      dispatch(
        setFeedback({
          message: "Equipamento criado com sucesso",
          type: "success",
        })
      );
    } catch (error: any) {
      dispatch(
        setFeedback({
          message: `Erro ao criar equipamento: ${error}`,
          type: "error",
        })
      );
    }
  };

  const fetchDataCallback = useCallback(async () => {
    try {
      if (editingEquipamento || id) {
        const equip = await EquipamentoService.getEquipamentoById(
          Number(editingEquipamento || id)
        );
        setFormData({
          nome: equip.nome,
          id_cliente: equip.id_cliente,
        });

        if (equip.timeout_online_segundos != null) {
          const display = secondsToTimeoutDisplay(equip.timeout_online_segundos);
          setTimeoutValue(display.value);
          setTimeoutUnit(display.unit);
        } else {
          setTimeoutValue('');
          setTimeoutUnit('segundos');
        }

        setEquipamentoId(equip.id);
        setValidationErrors({});
      }
    } catch (error: any) {
      dispatch(
        setFeedback({
          message: `Erro ao buscar equipamento: ${error}`,
          type: "error",
        })
      );
    }
  }, [editingEquipamento, id, dispatch]);

  useEffect(() => {
    fetchDataCallback();
  }, [fetchDataCallback]);

  const timeoutPreviewSeconds =
    timeoutValue === '' ? null : convertToTimeoutSeconds(Number(timeoutValue), timeoutUnit);

  return (
    <Box
      component="form"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 2,
        width: "100%",
      }}
    >
      <Box
        sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
      >
        {fields.map((field) => (
          <Stack
            key={field.label}
            direction={"column"}
            alignItems={"flex-start"}
            sx={{ width: "100%" }}
          >
            <Input
              key={field.label}
              label={field.label}
              name={field.name}
              value={formData[field.name as keyof EquipmentForm] || ''}
              onChange={handleChange}
              disabled={disabled}
              required
              maxLength={field.name === 'nome' ? 28 : undefined}
            />
            {validationErrors[field.name] && (
              <span className="mt-1 text-xs text-red-500">
                {validationErrors[field.name]}
              </span>
            )}
          </Stack>
        ))}

        <Stack direction="column" alignItems="flex-start" sx={{ width: "100%" }}>
          <Typography
            component="label"
            sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500, color: 'text.secondary' }}
          >
            Timeout status online
          </Typography>
          <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
            <Box sx={{ flex: 1 }}>
              <Input
                name="timeout_online_value"
                type="number"
                value={timeoutValue}
                onChange={handleTimeoutValueChange}
                disabled={disabled}
                min={1}
              />
            </Box>
            <FormControl size="small" sx={{ minWidth: 130 }} disabled={disabled}>
              <Select
                value={timeoutUnit}
                onChange={(e) => handleTimeoutUnitChange(e.target.value as TimeoutOnlineUnit)}
              >
                {TIMEOUT_ONLINE_UNIT_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
            Tempo sem logs para considerar offline. Vazio = 10s (padrão). A verificação inclui margem de 10s de latência.
            {timeoutPreviewSeconds !== null && (
              <> Equivale a <strong>{timeoutPreviewSeconds}s</strong> no servidor.</>
            )}
          </Typography>
          {validationErrors.timeout_online && (
            <span className="mt-1 text-xs text-red-500">
              {validationErrors.timeout_online}
            </span>
          )}
        </Stack>

        {!id && optionFields.map((field) => (
          <Stack
            key={field.name}
            direction={"column"}
            alignItems={"flex-start"}
            sx={{ width: "100%" }}
          >
            <OptionsField
              options={clientOptions}
              label={field.label}
              value={formData[field.name as keyof EquipmentForm]}
              onChange={handleClientChange}
              disabled={disabled}
              required
            />
            {validationErrors[field.name] && (
              <span className="mt-1 text-xs text-red-500">
                {validationErrors[field.name]}
              </span>
            )}
          </Stack>
        ))}
      </Box>
      {!disabled && (
        <Stack direction={"row"} justifyContent="flex-end" gap={2} width={"100%"}>
          <BaseButton type="submit" onClick={handleSubmit}>
            Salvar
          </BaseButton>
          <BaseCancelButton
            onClick={() => {
              setValidationErrors({});
              if (id) {
                resetFormData();
              }
              dispatch(setCreatingEquipamento(false));
              dispatch(setEditingEquipamento(null));
            }}
          >
            Cancelar
          </BaseCancelButton>
        </Stack>
      )}
    </Box>
  );
}

export default EquipamentoForm;
