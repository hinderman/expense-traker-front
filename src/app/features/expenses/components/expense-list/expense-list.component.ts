import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ExpenseService } from '../../services/expense.service';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DashboardComponent, RouterModule],
  template: `
    <div class="container mx-auto p-4">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Gestión de Gastos</h1>
        <button routerLink="/expenses/new" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
          + Nueva Solicitud
        </button>
      </div>

      <app-expense-dashboard />

      <form [formGroup]="filterForm" class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-xs text-gray-500 mb-1">Estado</label>
          <select formControlName="statusId" class="w-full border-gray-300 rounded-md text-sm">
            <option value="">Todos</option>
            <option value="pending-id">Pendiente</option>
            <option value="approved-id">Aprobada</option>
            <option value="rejected-id">Rechazada</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Fecha Inicio</label>
          <input type="date" formControlName="startDate" class="w-full border-gray-300 rounded-md text-sm">
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-1">Fecha Fin</label>
          <input type="date" formControlName="endDate" class="w-full border-gray-300 rounded-md text-sm">
        </div>
        <div class="flex items-end">
          <button type="button" (click)="applyFilters()" class="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium">
            Aplicar Filtros
          </button>
        </div>
      </form>

      <div class="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            @if (isLoading()) {
              <tr><td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">Cargando solicitudes...</td></tr>
            } @else if (expenses().length === 0) {
              <tr><td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">No hay datos para mostrar.</td></tr>
            } @else {
              @for (expense of expenses(); track expense.id) {
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ expense.expenseDate | date }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ expense.categoryName }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ expense.amount | currency }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                          [ngClass]="{
                            'bg-yellow-100 text-yellow-800': expense.statusName === 'Pendiente',
                            'bg-green-100 text-green-800': expense.statusName === 'Aprobada',
                            'bg-red-100 text-red-800': expense.statusName === 'Rechazada'
                          }">
                      {{ expense.statusName }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <a [routerLink]="['/expenses', expense.id]" class="text-blue-600 hover:text-blue-900">Detalle</a>
                    @if (expense.statusName === 'Pendiente') {
                      <button (click)="onApprove(expense.id)" class="text-green-600 hover:text-green-900">Aprobar</button>
                      <button (click)="onReject(expense.id)" class="text-red-600 hover:text-red-900">Rechazar</button>
                    }
                  </td>
                </tr>
              }
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class ExpenseListComponent implements OnInit {
  private expenseService = inject(ExpenseService);
  private fb = inject(FormBuilder);

  expenses = this.expenseService.expenses;
  isLoading = this.expenseService.isLoading;

  filterForm = this.fb.nonNullable.group({
    statusId: [''],
    categoryId: [''],
    startDate: [''],
    endDate: ['']
  });

  ngOnInit() {
    this.expenseService.loadExpenses();
  }

  applyFilters() {
    const filters = this.filterForm.getRawValue();
    this.expenseService.loadExpenses(filters);
  }

  onApprove(id: string) {
    if(confirm('¿Seguro que deseas aprobar esta solicitud?')) {
      this.expenseService.approve(id).subscribe(() => {
        this.applyFilters(); // Recarga la lista y métricas
        this.expenseService.loadMetrics();
      });
    }
  }

  onReject(id: string) {
    if(confirm('¿Seguro que deseas rechazar esta solicitud?')) {
      this.expenseService.reject(id).subscribe(() => {
        this.applyFilters();
        this.expenseService.loadMetrics();
      });
    }
  }
}