import { Routes } from '@angular/router';

export const routes: Routes = [
    {
    path: '',
    redirectTo: 'expenses',
    pathMatch: 'full'
  },
  {
    path: 'expenses',
    // Cargamos las rutas hijas de forma perezosa
    loadChildren: () => import('./features/expenses/expenses.routes').then(m => m.EXPENSES_ROUTES)
  },
  {
    path: '**',
    redirectTo: 'expenses'
  }
];
