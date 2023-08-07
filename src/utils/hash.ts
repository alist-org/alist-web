import { sha256 } from "sha-anything"

const hash_salt = "https://github.com/alist-org/alist"

export async function hashPwd(pwd: string) {
  return await sha256(`${pwd}-${hash_salt}`)
}
