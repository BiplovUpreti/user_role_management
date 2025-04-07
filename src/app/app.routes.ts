import { Routes } from '@angular/router';
import { privateRoutes } from './private/private.routes';
import { publicRoutes } from './public/public.routes';

const NotFoundComponent = () =>
  import('./shared/components/not-found/not-found.component').then(
    (m) => m.NotFoundComponent
  );

export const routes: Routes = [
  ...privateRoutes,
  ...publicRoutes,
  {
    path: '**',
    loadComponent: NotFoundComponent,
  },
];
