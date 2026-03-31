// src/app/features/expenses/components/expense-form/expense-form.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ExpenseService } from '../../services/expense.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">Nueva Solicitud de Gasto</h2>
      
      <form [formGroup]="expenseForm" (ngSubmit)="onSubmit()" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Descripción</label>
          <input type="text" formControlName="description" 
                 class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
          @if (expenseForm.get('description')?.invalid && expenseForm.get('description')?.touched) {
            <span class="text-red-500 text-xs">La descripción es obligatoria.</span>
          }
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Monto</label>
          <input type="number" formControlName="amount" 
                 class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
          @if (expenseForm.get('amount')?.errors?.['min'] && expenseForm.get('amount')?.touched) {
            <span class="text-red-500 text-xs">El monto debe ser mayor a cero.</span>
          }
        </div>

        <button type="submit" [disabled]="expenseForm.invalid || isSubmitting()"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300">
          {{ isSubmitting() ? 'Guardando...' : 'Guardar Solicitud' }}
        </button>
      </form>
    </div>
  `
})
export class ExpenseFormComponent {
  private fb = inject(FormBuilder);
  private expenseService = inject(ExpenseService);
  private router = inject(Router);

  isSubmitting = signal(false);

  // Formulario reactivo con validaciones 
  expenseForm = this.fb.nonNullable.group({
    description: ['', Validators.required],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    expenseDate: ['', Validators.required],
    categoryId: ['', Validators.required],
    // Valores por defecto u ocultos
    requestedById: ['user-id-mock'], 
    statusId: ['pending-status-id'],
    currencyId: ['currency-id']
  });

  onSubmit() {
    if (this.expenseForm.valid) {
      this.isSubmitting.set(true);
      this.expenseService.create(this.expenseForm.getRawValue()).subscribe({
        next: () => {
          this.isSubmitting.set(false);
          this.router.navigate(['/expenses']);
        },
        error: (err) => {
          this.isSubmitting.set(false);
          console.error('Error creando gasto', err);
        }
      });
    }
  }
}