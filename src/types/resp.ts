import { Obj } from "."

export interface Resp<T> {
  code: number
  message: string
  data: T
}

export type PageResp<T> = Resp<{
  content: T[]
  total: number
}>

export type FsListResp = Resp<{
  content: Obj[]
  total: number
  readme: string
  write: boolean
  provider: string
}>

export type FsGetResp = Resp<
  Obj & {
    raw_url: string
    readme: string
    provider: string
    related: Obj[]
  }
>

export type EmptyResp = Resp<{}>

export type PResp<T> = Promise<Resp<T>>
export type PPageResp<T> = Promise<PageResp<T>>
export type PEmptyResp = Promise<EmptyResp>
