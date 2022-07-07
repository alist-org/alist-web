let api = import.meta.env.VITE_SERVER_URL as string;
if (window.ALIST.api) {
  api = window.ALIST.api;
}
if (api.endsWith("/")) {
  api = api.slice(0, -1);
}

let root_path = "";
export const setBasePath = (path: string) => {
  root_path = path;
  if (root_path.endsWith("/")) {
    root_path = root_path.slice(0, -1);
  }
};
export { api, root_path };
