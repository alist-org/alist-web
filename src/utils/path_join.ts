import { root_path } from "./base_url";

export const pathJoin = (...paths: string[]) => {
  return paths.join("/").replace(/\/{2,}/g, "/");
};

export const joinRoot = (...paths: string[]) => {
  return pathJoin(root_path, ...paths);
};

export const trimRoot = (path: string) => {
  return path.replace(root_path, "");
};

export const baseName = (path: string) => {
  return path.split("/").pop();
};

