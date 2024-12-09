import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    // {
    //     path: '',
    //     pathMatch: 'full',
    //     redirectTo: 'admin'
    // },
    {
        path: 'admin',
        canActivate: [authGuard],
        data: { roles: ['Administrador'] },
        loadComponent: () => import('./pages/admin/admin.component').then(mod => mod.AdminComponent)
    },
    {
        path: 'teachers',
        canActivate: [authGuard],
        data: { roles: ['Administrador', 'Recepcionista'] },
        loadComponent: () => import('./pages/teachers/teachers.component').then(mod => mod.TeachersComponent)
    },
    {
        path: 'equipments',
        canActivate: [authGuard],
        data: { roles: ['Administrador', 'Instrutor', 'Aluno'] },
        loadComponent: () => import('./pages/equipments/equipments.component').then(mod => mod.EquipmentsComponent)
    },
    {
        path: 'units',
        canActivate: [authGuard],
        data: { roles: ['Administrador', 'Recepcionista'] },
        loadComponent: () => import('./pages/units/units.component').then(mod => mod.UnitsComponent)
    },
    {
        path: 'plans',
        canActivate: [authGuard],
        data: { roles: ['Administrador', 'Recepcionista'] },
        loadComponent: () => import('./pages/plans/plans.component').then(mod => mod.PlansComponent)
    },
    {
        path: 'calendar',
        canActivate: [authGuard],
        data: { roles: ['Administrador', 'Aluno'] },
        loadComponent: () => import('./pages/calendar/calendar.component').then(mod => mod.CalendarComponent)
    },
    {
        path: 'register',
        canActivate: [authGuard],
        data: { roles: ['Administrador', 'Recepcionista'] },
        loadComponent: () => import('./pages/register/register.component').then(mod => mod.RegisterComponent)
    },
    {
        path: 'restaurant',
        canActivate: [authGuard],
        data: { roles: ['Administrador'] },
        loadComponent: () => import('./pages/restaurant/restaurant.component').then(mod => mod.RestaurantComponent)
    },
    {
        path: 'employees',
        canActivate: [authGuard],
        data: { roles: ['Administrador', 'Recepcionista'] },
        loadComponent: () => import('./pages/employees/employees.component').then(mod => mod.EmployeesComponent)
    },
    {
        path: 'performance',
        canActivate: [authGuard],
        data: { roles: ['Administrador', 'Instrutor'] },
        loadComponent: () => import('./pages/performance/performance.component').then(mod => mod.PerformanceComponent)
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login.component').then(mod => mod.LoginComponent)
    },
    {
        path: 'training',
        canActivate: [authGuard],
        data: { roles: ['Administrador', 'Instrutor'] },
        loadComponent: () => import('./pages/training/training.component').then(mod => mod.TrainingComponent)
    }
];