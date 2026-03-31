import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseService } from '../../services/expense.service';

@Component({
  selector: 'app-expense-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      @if (metrics(); as m) {
        <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 class="text-gray-500 text-sm font-medium">Total Solicitudes</h3>
          <p class="text-3xl font-bold text-gray-800">{{ m.totalRequests }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-sm border border-green-100">
          <h3 class="text-green-600 text-sm font-medium">Aprobadas</h3>
          <p class="text-3xl font-bold text-green-700">{{ m.approvedCount }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-sm border border-red-100">
          <h3 class="text-red-600 text-sm font-medium">Rechazadas</h3>
          <p class="text-3xl font-bold text-red-700">{{ m.rejectedCount }}</p>
        </div>
        <div class="bg-white p-6 rounded-lg shadow-sm border border-blue-100">
          <h3 class="text-blue-600 text-sm font-medium">Monto Aprobado</h3>
          <p class="text-3xl font-bold text-blue-700">{{ m.totalApprovedAmount | currency }}</p>
        </div>
      } @else {
        <div class="col-span-4 text-center py-4 text-gray-500 animate-pulse">
          Cargando métricas...
        </div>
      }
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private expenseService = inject(ExpenseService);
  metrics = this.expenseService.metrics;

  ngOnInit() {
    this.expenseService.loadMetrics();
  }
}