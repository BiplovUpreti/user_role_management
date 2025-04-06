export type UserType = 'ADMIN' | 'NORMAL';
export interface Role {
  id: number;
  name: string;
  userType: UserType;
  permissions: string[];
}
