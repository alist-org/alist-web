import sha256 from "sha256"

const hash_salt = "https://github.com/alist-org/alist"

export function hashPwd(pwd: string) {
  return sha256(`${pwd}-${hash_salt}`)
}
