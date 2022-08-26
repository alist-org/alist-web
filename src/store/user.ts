import { createSignal } from "solid-js";
import { User, UserMethods, UserPermissions } from "~/types";

type Me = User & { otp: boolean };
const [user, setUser] = createSignal<Me>({} as Me);

type Permission = typeof UserPermissions[number];
export const userCan = (p: Permission) => {
  const u = user();
  return UserMethods.can(u, UserPermissions.indexOf(p));
};

export { user, setUser };
