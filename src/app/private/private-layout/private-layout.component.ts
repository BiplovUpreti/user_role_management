import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { CommonModule } from '@angular/common';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

import { SIDEBAR_ROUTES } from '../../core/constants/sidebar-routes';
import { AuthStore } from '../../core/store/auth.store';

@Component({
  selector: 'app-private-layout',
  imports: [
    CommonModule,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    NzBreadCrumbModule,
    RouterOutlet,
    RouterLink,
    NzAvatarModule,
    NzDropDownModule,
  ],
  templateUrl: './private-layout.component.html',
  styleUrl: './private-layout.component.scss',
})
export class PrivateLayoutComponent {
  router = inject(Router);
  authStore = inject(AuthStore);
  readonly sidebarRoutes = SIDEBAR_ROUTES;

  getCurrentPageTitle(): string {
    const currentRoute = this.sidebarRoutes.find((route) =>
      this.router.isActive(route.path, false)
    );
    return currentRoute?.title || '';
  }
}
