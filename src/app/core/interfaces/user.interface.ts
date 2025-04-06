import { Role } from './role.interface';

export interface User {
  id: number;
  fullName: string;
  username: string;
  password: string;
  email: string;
  roleId: number;
  role: Role | undefined;
}
