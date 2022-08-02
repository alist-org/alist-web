let api = import.meta.env.VITE_SERVER_URL as string;
if (window.ALIST.api) {
  api = window.ALIST.api;
}
if (api.endsWith("/")) {
  api = api.slice(0, -1);
}

let base_path = "";
export const setBasePath = (path: string) => {
  base_path = path;
  if (base_path.endsWith("/")) {
    base_path = base_path.slice(0, -1);
  }
};
if (window.ALIST.base_path) {
  setBasePath(window.ALIST.base_path);
}
export { api, base_path };
