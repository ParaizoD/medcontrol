import { http } from './http';
import { env } from '@/lib/env';
import { mockDashboardStats } from './mocks/data';
import type { DashboardStats } from '@/types';

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    // TODO(api): Integrar com endpoint GET /dashboard/stats
    if (env.USE_MOCKS) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return mockDashboardStats;
    }

    const { data } = await http.get<DashboardStats>('/dashboard/stats');
    return data;
  },
};
