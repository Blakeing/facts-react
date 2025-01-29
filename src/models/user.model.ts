import type { BaseEntity } from '../types'

export interface User extends BaseEntity {
  email: string
  firstName: string
  lastName: string
  // role: UserRole
}

// export enum UserRole {
//   ADMIN = 'ADMIN',
//   USER = 'USER',
// }
