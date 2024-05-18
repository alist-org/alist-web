export enum ObjType {
  UNKNOWN,
  FOLDER,
  // OFFICE,
  VIDEO,
  AUDIO,
  TEXT,
  IMAGE,
}

export interface Obj {
  name: string
  size: number
  is_dir: boolean
  modified: string
  sign?: string
  thumb: string
  type: ObjType
  path: string
}

export type StoreObj = Obj & {
  selected?: boolean
}

export type RenameObj = {
  src_name: string
  new_name: string
}
