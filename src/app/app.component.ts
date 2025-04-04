import { Component } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NzLayoutModule, NzMenuModule, NzIconModule],
  template: `
    <nz-layout>
      <nz-header>User Role Management</nz-header>
      <nz-content>Content</nz-content>
    </nz-layout>
  `
})
export class AppComponent {}
