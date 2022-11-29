import { Type } from "."

export interface DriverItem {
  name: string
  type: Type
  default: string
  options: string
  required?: boolean
  help?: string
}

export interface DriverConfig {
  name: string
  local_sort: boolean
  only_local: boolean
  only_proxy: boolean
  no_cache: boolean
  no_upload: boolean
  need_ms: boolean
  default_root: string
}
