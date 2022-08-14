export enum ObjType {
  UNKNOWN,
  FOLDER,
  OFFICE,
  VIDEO,
  AUDIO,
  TEXT,
  IMAGE,
}

export interface Obj {
  name: string;
  size: number;
  is_dir: boolean;
  modified: string;
  sign?: string;
  raw_url?: string;
  type: ObjType;
  thumb: string;
}

export type StoreObj = Obj & {
  selected?: boolean;
};
