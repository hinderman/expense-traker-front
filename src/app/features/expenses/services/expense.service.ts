import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SummaryDto, DetailDto, ExpenseRequestDto, MetricsDto } from '../../../core/models/expense.model';
import { finalize } from 'rxjs';
import { Pagination } from '../../../core/models/pagination.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/ExpenseRequest`;

  // Estado global reactivo de la feature
  expenses = signal<SummaryDto[]>([]);
  metrics = signal<MetricsDto | null>(null);
  currentExpense = signal<DetailDto | null>(null);
  isLoading = signal<boolean>(false);

  loadExpenses(filters: { statusId: string | null; categoryId: string | null; startDate: string | null; endDate: string | null } = {
    statusId: null,
    categoryId: null,
    startDate: null,
    endDate: null
  }) {
    this.isLoading.set(true);
    let params = new HttpParams();
    
    if (filters.statusId) params = params.set('prmStatusId', filters.statusId);
    if (filters.categoryId) params = params.set('prmCategoryId', filters.categoryId);
    if (filters.startDate) params = params.set('prmStartDate', filters.startDate);
    if (filters.endDate) params = params.set('prmEndDate', filters.endDate);

    this.http.get<Pagination<SummaryDto>>(this.apiUrl, { params })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (res) => this.expenses.set(res.items)
      });
  }

  loadMetrics() {
    this.http.get<MetricsDto>(`${this.apiUrl}/summary`).subscribe({
      next: (res) => this.metrics.set(res)
    });
  }

  loadById(id: string) {
    this.isLoading.set(true);
    this.http.get<DetailDto>(`${this.apiUrl}/${id}`)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (res) => this.currentExpense.set(res)
      });
  }

  create(data: ExpenseRequestDto) {
    return this.http.post(this.apiUrl, data);
  }

  update(id: string, data: Partial<ExpenseRequestDto>) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  approve(id: string) {
    return this.http.patch(`${this.apiUrl}/${id}/approve`, {});
  }

  reject(id: string) {
    return this.http.patch(`${this.apiUrl}/${id}/reject`, {});
  }
}