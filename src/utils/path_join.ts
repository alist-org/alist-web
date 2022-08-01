import { base_path } from "./base_url";

export const pathJoin = (...paths: string[]) => {
  return paths.join("/").replace(/\/{2,}/g, "/");
};

export const joinBase = (...paths: string[]) => {
  return pathJoin(base_path, ...paths);
};

export const trimBase = (path: string) => {
  return path.replace(base_path, "");
};

export const baseName = (path: string) => {
  return path.split("/").pop();
};

