import { Type } from ".";

export interface DriverItem {
  name: string;
  type: Type;
  default: string;
  values: string;
  required?: boolean;
  help?: string;
}
