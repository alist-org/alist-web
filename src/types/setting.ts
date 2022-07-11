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

export enum Type {
  TypeString = "string",
  TypeSelect = "select",
  TypeBool = "bool",
  TypeText = "text",
  TypeNumber = "number",
}
export interface SettingItem {
  key: string;
  value: string;
  type: Type;
  help: string;
  values?: string;
  group: Group;
  flag: Flag;
}
