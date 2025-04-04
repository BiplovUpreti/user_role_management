import { Routes } from '@angular/router';

const PublicLayoutComponent = () =>
  import('./public-layout/public-layout.component').then(
    (m) => m.PublicLayoutComponent
  );
const LoginComponent = () =>
  import('./login/login.component').then((m) => m.LoginComponent);

export const publicRoutes: Routes = [
  {
    path: '',
    loadComponent: PublicLayoutComponent,
    children: [{ path: 'login', loadComponent: LoginComponent }],
  },
];
