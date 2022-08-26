import { Type } from ".";

export interface DriverItem {
  name: string;
  type: Type;
  default: string;
  options: string;
  required?: boolean;
  help?: string;
}
