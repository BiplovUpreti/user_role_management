import { UserOutline, LockOutline } from '@ant-design/icons-angular/icons';
import { User } from '../interfaces/user.interface';

export interface SidebarRoute {
  path: string;
  title: string;
  icon: any;
  permission?: string;
  visible?: (user: any) => boolean;
}

export const SIDEBAR_ROUTES: SidebarRoute[] = [
  {
    path: '/users',
    title: 'User Management',
    icon: 'user',
    permission: 'user.view',
    visible: (user) => true,
  },
  {
    path: '/roles',
    title: 'Role Management',
    icon: 'lock',
    permission: 'role.view',
    visible: (user) => user?.role?.userType === 'ADMIN',
  },
];

export const getFilteredSidebarRoutes = (user: User) => {
  return SIDEBAR_ROUTES.filter((route) =>
    route.visible ? route.visible(user) : true
  );
};

export const SIDEBAR_ICONS = [UserOutline, LockOutline];
