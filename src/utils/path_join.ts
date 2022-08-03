import { base_path } from "./base_url";

export const pathJoin = (...paths: string[]) => {
  return paths.join("/").replace(/\/{2,}/g, "/");
};

export const joinBase = (...paths: string[]) => {
  return pathJoin(base_path, ...paths);
};

export const trimBase = (path: string) => {
  const res = path.replace(base_path, "");
  if (res.startsWith("/")) {
    return res;
  }
  return "/" + res;
};

export const baseName = (path: string) => {
  return path.split("/").pop();
};

export const encodePath = (path: string) =>
  path
    .split("/")
    .map((p) =>
      ["/", "#", "?"].some((c) => p.includes(c)) ? encodeURIComponent(p) : p
    )
    .join("/");
