export type ErpRecord = Record<string, string | number | boolean | null | undefined>;

export type DashboardSummary = {
  totalOrders?: number;
  totalRevenue?: number;
  totalExpenses?: number;
  netProfit?: number;
  totalProducts?: number;
  totalCustomers?: number;
  inventoryValue?: number;
  recentOrders?: ErpRecord[];
  recentPayments?: ErpRecord[];
  lowStock?: ErpRecord[];
};
