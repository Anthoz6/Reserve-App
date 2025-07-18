export enum RoleEnum {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
  PROVIDER = 'PROVIDER',
}

export interface Role {
  id: number;
  role: RoleEnum;
}
