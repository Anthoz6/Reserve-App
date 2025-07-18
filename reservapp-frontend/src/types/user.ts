import { Role } from './role';

export interface User {
  id: number;
  email: string;
  name: string;
  role: Role;
  enabled: boolean;
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
}
