import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
    },
    {
        path: 'dashboard',  
        canActivate: [authGuard],
        data: { roles: ['Gerente', 'Administrador', 'Instrutor', 'Aluno', 'Colaborador'] },
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(mod => mod.DashboardComponent)
    },
    {
        path: 'feedback',
        canActivate: [authGuard],
        data: { roles: ['Gerente', 'Administrador', 'Instrutor', 'Aluno', 'Colaborador'] },
        loadComponent: () => import('./pages/feedback/feedback.component').then(mod => mod.FeedbackComponent)
    },
    {
        path: 'invite',
        canActivate: [authGuard],
        data: { roles: ['Gerente', 'Administrador', 'Aluno'] },
        loadComponent: () => import('./pages/invite/invite.component').then(mod => mod.InviteComponent)
    },
    {
        path: 'users',
        canActivate: [authGuard],
        data: { roles: ['Gerente', 'Administrador', 'Instrutor', 'Aluno', 'Colaborador'] },
        loadComponent: () => import('./pages/users/users.component').then(mod => mod.UsersComponent)
    },
    {
        path: 'teachers',
        canActivate: [authGuard],
        data: { roles: ['Gerente', 'Administrador', 'Instrutor', 'Aluno', 'Colaborador'] },
        loadComponent: () => import('./pages/teachers/teachers.component').then(mod => mod.TeachersComponent)
    },
    {
        path: 'equipments',
        canActivate: [authGuard],
        data: { roles: ['Gerente', 'Administrador', 'Instrutor', 'Aluno', 'Colaborador'] },
        loadComponent: () => import('./pages/equipments/equipments.component').then(mod => mod.EquipmentsComponent)
    },
    {
        path: 'units',
        canActivate: [authGuard],
        data: { roles: ['Gerente', 'Administrador', 'Instrutor', 'Aluno', 'Colaborador'] },
        loadComponent: () => import('./pages/units/units.component').then(mod => mod.UnitsComponent)
    },
    {
        path: 'plans',
        canActivate: [authGuard],
        data: { roles: ['Gerente', 'Administrador', 'Colaborador'] },
        loadComponent: () => import('./pages/plans/plans.component').then(mod => mod.PlansComponent)
    },
    {
        path: 'calendar',
        canActivate: [authGuard],
        data: { roles: ['Gerente', 'Administrador', 'Instrutor', 'Aluno', 'Colaborador'] },
        loadComponent: () => import('./pages/calendar/calendar.component').then(mod => mod.CalendarComponent)
    },
    {
        path: 'register',
        canActivate: [authGuard],
        data: { roles: ['Gerente', 'Administrador', 'Instrutor', 'Aluno', 'Colaborador'] },
        loadComponent: () => import('./pages/register/register.component').then(mod => mod.RegisterComponent)
    },
    {
        path: 'restaurant',
        canActivate: [authGuard],
        data: { roles: ['Gerente', 'Administrador', 'Instrutor', 'Aluno', 'Colaborador'] },
        loadComponent: () => import('./pages/restaurant/restaurant.component').then(mod => mod.RestaurantComponent)
    },
    {
        path: 'employees',
        canActivate: [authGuard],
        data: { roles: ['Gerente', 'Administrador', 'Instrutor', 'Aluno', 'Colaborador'] },
        loadComponent: () => import('./pages/employees/employees.component').then(mod => mod.EmployeesComponent)
    },
    {
        path: 'performance',
        canActivate: [authGuard],
        data: { roles: ['Gerente', 'Administrador', 'Instrutor', 'Aluno', 'Colaborador'] },
        loadComponent: () => import('./pages/performance/performance.component').then(mod => mod.PerformanceComponent)
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login.component').then(mod => mod.LoginComponent)
    },
    {
        path: 'training',
        canActivate: [authGuard],
        data: { roles: ['Gerente', 'Administrador', 'Instrutor', 'Aluno', 'Colaborador'] },
        loadComponent: () => import('./pages/training/training.component').then(mod => mod.TrainingComponent)
    }
];