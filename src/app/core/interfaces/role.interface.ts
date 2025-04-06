export interface Role {
  id: number;
  name: string;
  userType: 'ADMIN' | 'NORMAL';
  permissions: string[];
}
