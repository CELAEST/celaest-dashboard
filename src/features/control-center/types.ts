export interface DashboardMetrics {
  totalRevenue: number;
  revenueGrowth: number;
  activeUsers: number;
  usersGrowth: number;
  totalTransactions: number;
  transactionsGrowth: number;
  activeLicenses: number;
  licensesGrowth: number;
  revenueByMonth: {
    month: string;
    amount: number;
  }[];
  recentTransactions: {
    id: string;
    amount: number;
    status: string;
    customer: string;
    date: string;
  }[];
}
