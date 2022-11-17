import { createSignal } from "solid-js"
import { User, UserMethods, UserPermissions } from "~/types"

export type Me = User & { otp: boolean }
const [me, setMe] = createSignal<Me>({} as Me)

type Permission = typeof UserPermissions[number]
export const userCan = (p: Permission) => {
  const u = me()
  return UserMethods.can(u, UserPermissions.indexOf(p))
}

export { me, setMe }
