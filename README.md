# ExpenseTraker - Gestor de Solicitudes de Gastos

**ExpenseTraker** es una aplicación web moderna para la gestión de solicitudes de gastos. Permite a los usuarios crear, consultar y aprobar solicitudes de gastos de manera eficiente, con un dashboard que muestra métricas en tiempo real.

---

## 📋 Descripción General

ExpenseTraker es una Single Page Application (SPA) construida con **Angular 21** que proporciona:

- ✅ Listado de solicitudes de gastos con filtros avanzados
- ✅ Dashboard con métricas globales (total, aprobadas, rechazadas, monto aprobado)
- ✅ Formulario reactivo para crear nuevas solicitudes
- ✅ Detalles de cada solicitud de gasto
- ✅ Operaciones de aprobación y rechazo
- ✅ Interfaz responsiva con **Tailwind CSS**
- ✅ Manejo de errores a nivel global con interceptores HTTP

---

## 🚀 Requisitos Previos

Antes de iniciar, asegúrate de tener instalado:

- **Node.js** (v20 o superior)
- **pnpm** (v9 o superior) - Package manager utilizado en el proyecto
- **Git** (para control de versiones)

Instalación de pnpm:
```bash
npm install -g pnpm
```

---

## 📦 Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/expense-traker-front.git
cd expense-traker-front
```

2. **Instalar dependencias**
```bash
pnpm install
```

3. **Configurar variables de entorno**
   - Editar `src/environments/environment.ts` con la URL de tu API backend
   ```typescript
   export const environment = {
     apiUrl: "http://localhost:3000"  // URL de tu API
   };
   ```

---

## 🏃 Ejecución

### Desarrollo Local
```bash
pnpm start
```
Accede a `http://localhost:4200` en tu navegador.

**Características en desarrollo:**
- Hot reload automático cuando modificas archivos
- Source maps para debugging
- Devtools integrando

### Tests Unitarios
```bash
pnpm test
```
Ejecuta tests con **Vitest** y Angular Testing Utilities.

---

## 📁 Estructura del Proyecto

```
expense-traker-front/
├── src/
│   ├── app/
│   │   ├── core/                    # Servicios compartidos y configuración central
│   │   │   ├── interceptors/        # HTTP Interceptors globales
│   │   │   │   └── error.interceptor.ts
│   │   │   └── models/              # DTOs e Interfaces de datos
│   │   │       ├── expense.model.ts
│   │   │       └── pagination.model.ts
│   │   │
│   │   ├── features/                # Módulos de features organizados por dominio
│   │   │   └── expenses/
│   │   │       ├── components/      # Componentes de la feature
│   │   │       │   ├── dashboard/
│   │   │       │   ├── expense-form/
│   │   │       │   ├── expense-list/
│   │   │       │   └── expense-detail/
│   │   │       ├── services/        # Servicios específicos de la feature
│   │   │       │   └── expense.service.ts
│   │   │       └── expenses.routes.ts
│   │   │
│   │   ├── app.ts                   # Componente raíz
│   │   ├── app.routes.ts            # Rutas principales
│   │   ├── app.config.ts            # Configuración global de la app
│   │   ├── app.css                  # Estilos del componente raíz
│   │   └── app.html                 # Template raíz
│   │
│   ├── environments/                # Configuración por ambiente
│   │   └── environment.ts
│   │
│   ├── index.html                   # HTML principal
│   ├── main.ts                      # Entry point
│   └── styles.css                   # Estilos globales
│
├── angular.json                     # Configuración de Angular CLI
├── tsconfig.json                    # Configuración de TypeScript
├── tailwind.config.js               # Configuración de Tailwind CSS
├── .prettierrc                      # Configuración de Prettier
├── .editorconfig                    # Configuración de editor
├── package.json                     # Dependencias y scripts
└── README.md                        # Este archivo
```

---

## 🏗️ Arquitectura

### Arquitectura de Capas

ExpenseTraker implementa una **arquitectura por features** (Feature-Based Architecture) que facilita escalabilidad y mantenimiento:

```
┌─────────────────────────────────────┐
│         Componentes (UI Layer)      │
│  - DashboardComponent               │
│  - ExpenseFormComponent             │
│  - ExpenseListComponent             │
└──────────────┬──────────────────────┘
               │ inyección de dependencias
┌──────────────▼──────────────────────┐
│      Servicios (Business Layer)     │
│  - ExpenseService                   │
│  - Manejo de estado con Signals     │
└──────────────┬──────────────────────┘
               │ HttpClient
┌──────────────▼──────────────────────┐
│    API HTTP (Data Access Layer)     │
│  - Interceptores de errores         │
│  - Transformación de respuestas     │
└──────────────┬──────────────────────┘
               │
               ▼
      Backend API (REST)
```

### Flujo de Datos (UNIDIRECCIONAL)

```
Componente → Servicio → HttpClient → Backend
   ↑                                      │
   └──────────────────────────────────────┘
        (Signals/RxJS Observables)
```

---

## 🎨 Patrones de Diseño Utilizados

### 1. **Dependency Injection (DI)**
```typescript
// Inyección automática de dependencias
export class ExpenseService {
  private http = inject(HttpClient);
  private router = inject(Router);
}
```
✅ Facilita testing
✅ Desacoplamiento de componentes

### 2. **Reactive Signals** (Angular 21+)
```typescript
// Estado reactivo con Signals
expenses = signal<SummaryDto[]>([]);
isLoading = signal<boolean>(false);
metrics = signal<MetricsDto | null>(null);
```
✅ Estado reactivo sin RxJS innecesario
✅ Performance optimizado

### 3. **Observable + RxJS**
```typescript
// HTTP requests con manejo reactivo
this.http.get<Pagination<SummaryDto>>(url, { params })
  .pipe(finalize(() => this.isLoading.set(false)))
  .subscribe({ next: (res) => this.expenses.set(res.items) });
```
✅ Manejo de async operations
✅ Cancelación automática de requests

### 4. **Reactive Forms**
```typescript
// Formularios reactivos con validaciones
expenseForm = this.fb.nonNullable.group({
  description: ['', Validators.required],
  amount: [0, [Validators.required, Validators.min(0.01)]],
  expenseDate: ['', Validators.required],
  categoryId: ['', Validators.required]
});
```
✅ Validaciones robustas
✅ Mejor control programático

### 5. **Standalone Components**
```typescript
@Component({
  selector: 'app-dashboard',
  standalone: true,  // No requiere NgModule
  imports: [CommonModule],
  template: `...`
})
```
✅ Menos boilerplate
✅ Mejor tree-shaking

### 6. **Component Hierarchy & Composition**
```
App (Root)
 └── Router Outlet
      └── Expenses Feature
           ├── Dashboard
           ├── ExpenseForm
           ├── ExpenseList
           └── ExpenseDetail
```

### 7. **Service Locator + Singleton Pattern**
```typescript
@Injectable({
  providedIn: 'root'  // Singleton a nivel de aplicación
})
export class ExpenseService { }
```

### 8. **Interceptor Pattern**
```typescript
// Manejo centralizado de errores HTTP
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error) => {
      console.error('Error detectado a nivel global:', error);
      return throwError(() => error);
    })
  );
};
```

### 9. **Lazy Loading**
```typescript
// Carga perezosa de features
loadChildren: () => import('./features/expenses/expenses.routes')
  .then(m => m.EXPENSES_ROUTES)
```
✅ Reduce tamaño initial bundle
✅ Mejor performance

### 10. **Model-View-Controller (MVC)**
- **Model**: `SummaryDto`, `DetailDto`, `MetricsDto`
- **View**: Templates en componentes
- **Controller**: Lógica en componentes y servicios

---

## 💻 Estilo de Codificación

### TypeScript

**Configuración Strict Mode:**
```json
{
  "strict": true,
  "noImplicitOverride": true,
  "noPropertyAccessFromIndexSignature": true,
  "noImplicitReturns": true,
  "noFallthroughCasesInSwitch": true
}
```

**Convenciones:**

| Elemento | Convención | Ejemplo |
|----------|-----------|---------|
| **Nombres de clases** | PascalCase | `ExpenseService`, `DashboardComponent` |
| **Nombres de archivos** | kebab-case | `expense-form.component.ts` |
| **Propiedades privadas** | Prefijo `private` | `private http` |
| **Variables constantes** | UPPER_SNAKE_CASE | `const MAX_ITEMS = 10;` |
| **Métodos** | camelCase | `loadExpenses()`, `onSubmit()` |
| **Interfaces** | PascalCase + `Dto` | `SummaryDto`, `MetricsDto` |

### HTML/Templates

- ✅ Usar control flow modernos: `@if`, `@for`, `@else`
- ✅ Data binding con `{{ }}` (interpolación)
- ✅ Property binding con `[prop]="value"`
- ✅ Event binding con `(event)="handler()"`
- ✅ Two-way binding con `[(ngModel)]` (en formularios)
- ✅ Comentarios en templates: `<!-- comment -->`

### CSS/Tailwind

- ✅ Usar utilidades de Tailwind CSS
- ✅ Responsive con prefijos: `md:`, `lg:`, `sm:`
- ✅ Dark mode compatible
- ✅ Clases de estado: `hover:`, `focus:`, `disabled:`

Ejemplo:
```html
<button class="w-full py-2 px-4 text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 rounded-md">
  Enviar
</button>
```

---

## 📦 Dependencias Principales

### Runtime
- **@angular/core** (^21.2.0) - Framework principal
- **@angular/forms** (^21.2.0) - Manejo de formularios
- **@angular/router** (^21.2.0) - Enrutamiento
- **@angular/platform-browser** (^21.2.0) - API del navegador
- **rxjs** (~7.8.0) - Programación reactiva
- **tslib** (^2.3.0) - Utilidades de TypeScript

### Dev Dependencies
- **@angular/build** (^21.2.5) - Build tools
- **@angular/cli** (^21.2.5) - CLI de Angular
- **typescript** (~5.9.2) - Lenguaje de programación
- **tailwindcss** (^4.2.2) - Framework CSS
- **vitest** (^4.0.8) - Test runner
- **prettier** (^3.8.1) - Code formatter

---

## 🧪 Testing

### Estructura de Tests
```
src/
├── app/
│   ├── features/
│   │   └── expenses/
│   │       └── services/
│   │           ├── expense.service.ts
│   │           └── expense.service.spec.ts
```

### Ejecutar Tests
```bash
pnpm test
```

### Ejemplo de Test
```typescript
describe('ExpenseService', () => {
  let service: ExpenseService;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExpenseService]
    });
    service = TestBed.inject(ExpenseService);
  });

  it('should load expenses', () => {
    service.loadExpenses();
    expect(service.expenses()).toEqual([]);
  });
});
```

---

## 🔧 Configuración de Entorno

### Variables de Entorno

**Desarrollo** (`src/environments/environment.ts`):
```typescript
export const environment = {
  apiUrl: "http://localhost:3000"
};
```

## 📚 Comandos Útiles

```bash
# Iniciar servidor de desarrollo
pnpm start

# Build para producción
pnpm build

# Ejecutar tests
pnpm test

# Ejecutar tests con coverage
pnpm test -- --coverage

# Formatear código con Prettier
pnpm format

# Ver logs de la CLI
pnpm ng version
```

---

## 📖 Recursos Adicionales

- [Documentación Oficial de Angular](https://angular.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [RxJS Documentation](https://rxjs.dev/)
- [Angular Best Practices](https://angular.dev/guide/styleguide)

---

## 👥 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

---

## 📧 Soporte

Para reportar bugs o sugerencias, abre una [Issue](https://github.com/tu-usuario/expense-traker-front/issues).
