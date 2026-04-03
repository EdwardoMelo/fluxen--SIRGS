import type { ChartData } from './Chart';
import type { UsuarioEquipamentoDashboard } from './UsuarioEquipamentoDashboard';

export interface DashboardChartBundleEntry {
  dashboardItemId: number;
  chartData: ChartData | null;
  error: string | null;
}

export interface DashboardChartBundleResponse {
  items: UsuarioEquipamentoDashboard[];
  charts: DashboardChartBundleEntry[];
}
