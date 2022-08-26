import { Type } from ".";

export enum Group {
  SITE,
  STYLE,
  PREVIEW,
  GLOBAL,
  SINGLE,
  ARIA2,
}
export enum Flag {
  PUBLIC,
  PRIVATE,
  READONLY,
  DEPRECATED,
}

export interface SettingItem {
  key: string;
  value: string;
  type: Type;
  help: string;
  options?: string;
  group: Group;
  flag: Flag;
}