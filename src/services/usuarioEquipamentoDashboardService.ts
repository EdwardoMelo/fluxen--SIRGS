import api from '../api';
import type { UsuarioEquipamentoDashboard } from '../types/UsuarioEquipamentoDashboard';
import type { Equipamento } from '../types/Equipamento';
import type { TimeRange } from '../types/Chart';
import type {
  DashboardChartBundleResponse,
  AddEquipamentoToDashboardResult,
  UpdateTipoGraficoResult,
} from '../types/DashboardChartBundle';

class UsuarioEquipamentoDashboardService {
  static endpoint = 'api/usuario-equipamento-dashboard';

  /**
   * Busca todos os equipamentos do dashboard do usuário
   */
  static async getEquipamentosDashboard(userId: number): Promise<UsuarioEquipamentoDashboard[]> {
    const response = await api.get(`${this.endpoint}/${userId}`);
    return response.data;
  }

  /**
   * Equipamentos do dashboard + dados de gráfico de cada card (uma requisição).
   */
  static async getDashboardBundle(userId: number): Promise<DashboardChartBundleResponse> {
    const response = await api.get(`${this.endpoint}/${userId}/chart-bundle`);
    return response.data;
  }

  /**
   * Adiciona um equipamento ao dashboard do usuário
   */
  static async addEquipamentoToDashboard(
    userId: number,
    equipamentoId: number,
    id_metrica?: number | null,
    id_tipo_grafico?: number | null
  ): Promise<AddEquipamentoToDashboardResult> {
    const response = await api.post(this.endpoint, {
      userId,
      equipamentoId,
      id_metrica: id_metrica || null,
      id_tipo_grafico: id_tipo_grafico || null
    });
    return response.data as AddEquipamentoToDashboardResult;
  }

  /**
   * Remove um equipamento do dashboard do usuário por ID da associação
   */
  static async removeEquipamentoFromDashboardById(
    id: number
  ): Promise<DashboardChartBundleResponse> {
    const response = await api.delete(`${this.endpoint}/item/${id}`);
    return response.data.bundle as DashboardChartBundleResponse;
  }

  /**
   * Remove um equipamento do dashboard do usuário
   */
  static async removeEquipamentoFromDashboard(
    userId: number,
    equipamentoId: number,
    id_metrica?: number | null
  ): Promise<DashboardChartBundleResponse> {
    const params = id_metrica ? `?id_metrica=${id_metrica}` : '';
    const response = await api.delete(`${this.endpoint}/${userId}/${equipamentoId}${params}`);
    return response.data.bundle as DashboardChartBundleResponse;
  }

  /**
   * Verifica se um equipamento está no dashboard do usuário
   */
  static async checkEquipamentoInDashboard(
    userId: number,
    equipamentoId: number
  ): Promise<boolean> {
    const response = await api.get(`${this.endpoint}/${userId}/${equipamentoId}/check`);
    return response.data.exists;
  }

  /**
   * Atualiza o tipo de gráfico de uma associação existente
   */
  static async updateTipoGrafico(
    id: number,
    id_tipo_grafico: number | null,
    timeRange?: TimeRange
  ): Promise<UpdateTipoGraficoResult> {
    const response = await api.put(`${this.endpoint}/item/${id}/tipo-grafico`, {
      id_tipo_grafico: id_tipo_grafico || null,
      timeRange
    });
    return response.data as UpdateTipoGraficoResult;
  }

  static async updateTimeRange(
    id: number,
    timeRange: TimeRange
  ): Promise<DashboardChartBundleResponse> {
    const response = await api.patch(`${this.endpoint}/item/${id}/time-range`, {
      timeRange,
    });
    return response.data.bundle as DashboardChartBundleResponse;
  }

  /**
   * Busca apenas os equipamentos (sem a estrutura de associação)
   * @deprecated Use getEquipamentosDashboard para obter as associações completas com métricas
   */
  static async getEquipamentos(userId: number): Promise<Equipamento[]> {
    const dashboardItems = await this.getEquipamentosDashboard(userId);
    return dashboardItems
      .map(item => item.equipamento)
      .filter((equipamento): equipamento is Equipamento => equipamento !== undefined);
  }
}

export default UsuarioEquipamentoDashboardService;


