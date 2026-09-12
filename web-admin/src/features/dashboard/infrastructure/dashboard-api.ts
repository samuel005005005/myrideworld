import { apiRequest } from '../../../core/http/api-request';
import type { DashboardStats } from '../domain/dashboard-stats';

export async function obtenerDashboard(): Promise<DashboardStats> {
  return apiRequest<DashboardStats>('/api/admin/dashboard');
}
