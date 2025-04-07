import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth.guard';
import { permissionGuard } from '../core/guards/permission.guard';

const PrivateLayoutComponent = () =>
  import('./private-layout/private-layout.component').then(
    (m) => m.PrivateLayoutComponent
  );
const UserManagementComponent = () =>
  import('./user-management/user-management.component').then(
    (m) => m.UserManagementComponent
  );
const RoleManagementComponent = () =>
  import('./role-management/role-management.component').then(
    (m) => m.RoleManagementComponent
  );

export const privateRoutes: Routes = [
  {
    path: '',
    loadComponent: PrivateLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'users',
        loadComponent: UserManagementComponent,
      },
      {
        path: 'roles',
        loadComponent: RoleManagementComponent,
        canActivate: [permissionGuard],
      },
    ],
  },
];
