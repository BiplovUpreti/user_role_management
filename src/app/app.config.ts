import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { routes } from './app.routes';
import { NzConfig, provideNzConfig } from 'ng-zorro-antd/core/config';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { PlusOutline, DeleteOutline } from '@ant-design/icons-angular/icons';
import { provideNzI18n, en_US } from 'ng-zorro-antd/i18n';
import { SIDEBAR_ICONS } from './core/constants/sidebar-routes';

const ngZorroConfig: NzConfig = {
  message: {
    nzDuration: 2000,
    nzMaxStack: 3,
    nzPauseOnHover: true,
    nzAnimate: true,
    nzTop: 24,
  },
  notification: { nzTop: 240 },
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideStore(),
    provideEffects(),
    provideStoreDevtools({ maxAge: 25 }),
    provideNzConfig(ngZorroConfig),
    provideAnimations(),
    provideNzIcons([...SIDEBAR_ICONS, PlusOutline, DeleteOutline]),
    provideNzI18n(en_US),
  ],
};
