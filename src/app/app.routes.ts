import { Routes } from '@angular/router';
import { privateRoutes } from './private/private.routes';
import { publicRoutes } from './public/public.routes';

export const routes: Routes = [...privateRoutes, ...publicRoutes];
