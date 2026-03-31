export interface SummaryDto {
  id: string;
  categoryName: string;
  amount: number;
  expenseDate: string;
  statusName: 'Pendiente' | 'Aprobada' | 'Rechazada';
  description: string;
}

export interface DetailDto extends SummaryDto {
  requestedById: string;
  categoryId: string;
  statusId: string;
  currencyId: string;
}

export interface MetricsDto {
  totalRequests: number;
  approvedCount: number;
  rejectedCount: number;
  totalApprovedAmount: number;
}

export interface ExpenseRequestDto {
  requestedById: string;
  categoryId: string;
  statusId: string;
  currencyId: string;
  amount: number;
  expenseDate: string;
  description: string;
}