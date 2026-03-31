import { Routes } from '@angular/router';
import { ExpenseListComponent } from './components/expense-list/expense-list.component';
import { ExpenseFormComponent } from './components/expense-form/expense-form.component';

export const EXPENSES_ROUTES: Routes = [
  {
    // Esta es la ruta base: /expenses
    path: '',
    component: ExpenseListComponent
  },
  {
    // Ruta para crear: /expenses/new
    path: 'new',
    component: ExpenseFormComponent
  },
  {
    // Ruta para editar: /expenses/edit/:id
    path: 'edit/:id',
    component: ExpenseFormComponent
  },
//   {
//     // Ruta para detalle: /expenses/:id
//     path: ':id',
//     // Puedes crear un componente específico para el detalle
//     loadComponent: () => import('./components/expense-detail/expense-detail.component').then(c => c.ExpenseDetailComponent)
//   }
];