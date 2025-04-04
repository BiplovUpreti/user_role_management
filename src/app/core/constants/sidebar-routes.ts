import { NzIconModule } from 'ng-zorro-antd/icon';
import { UserOutline, LockOutline } from '@ant-design/icons-angular/icons';

export interface SidebarRoute {
  path: string;
  title: string;
  icon: any;
  permission?: string;
}

export const SIDEBAR_ROUTES: SidebarRoute[] = [
  {
    path: '/users',
    title: 'User Management',
    icon: UserOutline,
    permission: 'user.view'
  },
  {
    path: '/roles',
    title: 'Role Management',
    icon: LockOutline,
    permission: 'role.view'
  }
];

export const SIDEBAR_ICONS = [UserOutline, LockOutline];