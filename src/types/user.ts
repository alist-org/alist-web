export enum UserRole {
  GENERAL,
  GUEST,
  ADMIN,
}

export interface User {
  id: number;
  username: string;
  base_path: string;
  role: UserRole;
  permissions: number;
}

export const UserMethods = {
  is_guest: (user: User) => user.role === UserRole.GUEST,
  is_admin: (user: User) => user.role === UserRole.ADMIN,
  is_general: (user: User) => user.role === UserRole.GENERAL,
  can_see_hides: (user: User) =>
    UserMethods.is_admin(user) || (user.permissions & 1) == 1,
  can_access_without_password: (user: User) =>
    UserMethods.is_admin(user) || ((user.permissions >> 1) & 1) == 1,
  can_add_aria2_tasks: (user: User) =>
    UserMethods.is_admin(user) || ((user.permissions >> 2) & 1) == 1,
  can_write: (user: User) =>
    UserMethods.is_admin(user) || ((user.permissions >> 3) & 1) == 1,
  can_rename: (user: User) =>
    UserMethods.is_admin(user) || ((user.permissions >> 4) & 1) == 1,
  can_move: (user: User) =>
    UserMethods.is_admin(user) || ((user.permissions >> 5) & 1) == 1,
  can_copy: (user: User) =>
    UserMethods.is_admin(user) || ((user.permissions >> 6) & 1) == 1,
  can_remove: (user: User) =>
    UserMethods.is_admin(user) || ((user.permissions >> 7) & 1) == 1,
  can_webdav_read: (user: User) =>
    UserMethods.is_admin(user) || ((user.permissions >> 8) & 1) == 1,
  can_webdav_manage: (user: User) =>
    UserMethods.is_admin(user) || ((user.permissions >> 9) & 1) == 1,
};
