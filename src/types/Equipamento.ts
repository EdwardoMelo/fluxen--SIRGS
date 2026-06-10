import type { Cliente } from "./Cliente";

export interface Equipamento {
  id: number;
  nome: string;
  id_cliente: number;
  api_key?: string | null;
  timeout_online_segundos?: number | null;
  cliente?: Cliente;
  cliente_nome?: string;
}

export interface EquipamentoOnlineStatus {
  isOnline: boolean;
  lastLogAt: string | null;
  timeoutOnlineSegundos: number;
  latencyBufferSegundos: number;
  effectiveTimeoutSegundos: number;
}
